import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getLandingPageBySlug } from '../../services/landing';
import { getCourseById } from '../../services/courses';
import { trackCourseView } from '../../services/analytics';
import { LandingInscriptionForm, Spinner, SEO, FloatingActionsContainer, PrivacyNotice, FaqSection } from '@/components';
import { getOptimizedUrl } from '../../utils/image-utils';
import { LandingPageData, CourseData } from './types';
import { useCourseContext } from '../../context/CourseContext';

import { CheckIcon, StarIcon, ShieldIcon, LockIcon } from './Icons';
import { TESTIMONIALS, DEFAULT_BENEFITS, SPOTS_LEFT } from './data';

const LandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setActiveCourse } = useCourseContext();
  const [landing, setLanding] = useState<LandingPageData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // PageView para Meta Pixel: se dispara en montaje, sin esperar la API
  useEffect(() => {
    if (import.meta.env.PROD && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, []);

  useEffect(() => {
    const fetchLandingData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const landingRes = await getLandingPageBySlug(slug);
        if (landingRes.success && landingRes.data) {
          const landingData = landingRes.data as unknown as LandingPageData;
          setLanding(landingData);

          const courseRes = await getCourseById(landingData.courseId);
          const courseData = courseRes as unknown as CourseData;
          setCourse(courseData);
          
          // Sincronizar con el contexto global para que el botón de WhatsApp sepa qué curso es
          setActiveCourse(courseData as any);

          // Tracking Meta Pixel ViewContent + GA4
          trackCourseView(courseData.id, courseData.title, courseData.price);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, [slug, setActiveCourse]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Spinner text="Preparando tu lugar..." />
      </div>
    );
  }

  if (error || !landing || !course) {
    return <Navigate to="/cursos" replace />;
  }

  const title = landing.customTitle || course.title;
  const description = landing.customDescription || course.shortDescription;
  const formattedPrice = course.price
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(course.price)
    : null;

  return (
    <>
      <SEO
        title={title || 'Inscripción'}
        description={description}
        ogImage={getOptimizedUrl(course.imageUrl, 1200, 630)}
      />

      {/* Fuente premium */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ fontFamily: "'Inter', sans-serif" }} className="dark min-h-screen bg-gray-950 text-white">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Gradiente de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-gray-950 to-gray-950" />
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.4), transparent)' }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">

            {/* Badge de urgencia */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                Solo quedan {SPOTS_LEFT} lugares disponibles
              </span>
            </div>

            {/* Grid: copy + imagen */}
            <div className="grid lg:grid-cols-2 gap-10 items-center">

              {/* Columna izquierda: copy */}
              <div>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-5 uppercase">
                  {title}
                </h1>

                {description && (
                  <p className="text-lg text-gray-300 leading-relaxed mb-8">
                    {description}
                  </p>
                )}

                {/* Precio prominente */}
                {formattedPrice && (
                  <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-5xl font-black text-white">{formattedPrice}</span>
                    <span className="text-gray-400 text-sm">pago único</span>
                  </div>
                )}

                {/* Beneficios */}
                <ul className="space-y-3 mb-8">
                  {DEFAULT_BENEFITS.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-gray-200 text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA mobile: flecha hacia el form */}
                <p className="text-violet-400 text-sm font-medium lg:hidden">
                  ↓ Completá el formulario para reservar tu lugar
                </p>
              </div>

              {/* Columna derecha: imagen del curso */}
              <div className="relative">
                {course.imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/40 bg-gray-900/50">
                    <img
                      src={getOptimizedUrl(course.imageUrl, 800, 600, 'limit')}
                      alt={course.title}
                      className="w-full aspect-[4/3] object-contain"
                      loading="eager"
                    />
                    {/* Overlay sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                  </div>
                ) : (
                  /* Placeholder si no hay imagen */
                  <div className="rounded-2xl bg-gradient-to-br from-violet-800/30 to-violet-600/10 border border-violet-700/30 aspect-[4/3] flex items-center justify-center">
                    <span className="text-6xl">✂️</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── FORMULARIO + TRUST ──────────────────────────────────────────── */}
        <section className="bg-gray-950 py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">

            {/* Formulario: primero en mobile (order-1), sticky derecho en desktop */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-8">
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-violet-900/20">
                <LandingInscriptionForm course={course as any} landingPage={landing as any} />
              </div>
            </div>

            {/* Testimonios: segundo en mobile (order-2), izquierdo en desktop */}
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                Lo que dicen nuestras alumnas
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Más de 200 alumnas ya pasaron por nuestros cursos
              </p>

              <div className="space-y-5">
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/40"
                      />
                      <div>
                        <p className="text-white text-sm font-semibold">{t.name}</p>
                        <p className="text-gray-500 text-xs">{t.role}</p>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} filled={s <= t.rating} />)}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">"{t.text}"</p>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-xl p-3">
                  <ShieldIcon />
                  <div>
                    <p className="text-white text-xs font-bold">Datos 100% Seguros</p>
                    <p className="text-gray-500 text-[11px]">Tu información está protegida y nunca se comparte</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-xl p-3">
                  <LockIcon />
                  <div>
                    <p className="text-white text-xs font-bold">Pago a través de Mercado Pago</p>
                    <p className="text-gray-500 text-[11px]">No guardamos datos de tarjeta. Proceso externo y verificado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <FaqSection />

        {/* Compromiso de Privacidad y Ética */}
        <PrivacyNotice />

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-gray-900 py-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Modista App. Todos los derechos reservados.
          </p>
        </footer>

        {/* Botón flotante de WhatsApp sincronizado */}
        <FloatingActionsContainer />
      </div>
    </>
  );
};

export default LandingPage;

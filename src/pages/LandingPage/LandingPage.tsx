import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getLandingPageBySlug } from '../../services/landing';
import { getCourseById } from '../../services/courses';
import { trackCourseView } from '../../services/analytics';
import { Spinner, SEO, PrivacyNotice, FaqSection, LandingInscriptionForm } from '@/components';
import { getOptimizedUrl } from '../../utils/image-utils';
import { useCourseContext } from '../../context/CourseContext';
import { LandingPageData, CourseData } from './types';
import { BENEFITS, TESTIMONIALS, STATS } from './data';

const LandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setActiveCourse } = useCourseContext();
  const [landing, setLanding] = useState<LandingPageData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          setActiveCourse(courseData as any);

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
  const ctaText = landing.buttonText || 'QUIERO EMPEZAR AHORA';

  return (
    <>
      <SEO
        title={title || 'Inscripción'}
        description={description}
        ogImage={getOptimizedUrl(course.imageUrl, 1200, 630)}
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ fontFamily: "'Inter', sans-serif" }} className="dark min-h-screen bg-gray-950 text-white">

        {/* ── 1. HERO ───────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-gray-950 to-gray-950" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-0 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl" />

          <div className="relative max-w-xl mx-auto px-4 sm:px-6 pt-14 pb-16 text-center">
            <span className="inline-block bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
              Curso online de costura
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6 px-2">
              {title}
            </h1>

            {description && (
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-lg mx-auto">
                {description}
              </p>
            )}

            {course.imageUrl && (
              <div className="mb-8">
                <img
                  src={getOptimizedUrl(course.imageUrl, 500, 375)}
                  alt={course.title}
                  className="w-full max-w-[320px] mx-auto aspect-[4/3] object-cover rounded-2xl shadow-2xl shadow-violet-900/30"
                  loading="eager"
                />
              </div>
            )}

            <a
              href="#inscripcion"
              className="inline-flex flex-col items-center w-full sm:w-auto sm:px-20 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white py-5 px-8 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all active:scale-[0.98]"
            >
              <span className="text-xl font-black uppercase tracking-wide">{ctaText}</span>
              {formattedPrice && (
                <span className="text-sm font-medium text-violet-100 mt-1">
                  <strong className="text-white">{formattedPrice}</strong> · pago único
                </span>
              )}
            </a>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
              <span>🔒 Pago seguro</span>
              <span>📥 Acceso inmediato</span>
              <span>♾️ Sin vencimiento</span>
            </div>
          </div>
        </section>

        {/* ── 2. QUÉ INCLUYE ────────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-3">
              ¿Qué incluye el curso?
            </h2>
            <p className="text-gray-400 text-center text-sm mb-10 max-w-md mx-auto">
              Todo lo que necesitás para empezar a hacer tus propios abrigos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((b, i) => (
                <div key={i} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
                  <div className="text-3xl mb-3">{b.emoji}</div>
                  <h3 className="text-white font-bold text-base mb-2">{b.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. INSTRUCTORA ────────────────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6 bg-gray-900/30">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-black mb-8">Tu instructora</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
              <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-5 ring-2 ring-violet-500/30">
                <span className="text-3xl">🧵</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Mica Guevara</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                Instructora de costura con años de experiencia formando alumnas. Su método paso a paso te permite aprender desde cero, sin necesidad de experiencia previa.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. SOCIAL PROOF ───────────────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-center mb-2">
              Lo que dicen las alumnas
            </h2>
            <p className="text-gray-400 text-center text-sm mb-10">
              Resultados reales de quienes ya hicieron el curso
            </p>

            <div className="flex justify-center items-center gap-6 sm:gap-12 mb-10 text-center">
              {STATS.map((s, i) => (
                <div key={i} className="bg-gray-900/80 border border-gray-800 rounded-2xl px-6 py-4 min-w-[100px]">
                  <p className="text-xl sm:text-2xl font-black text-violet-400">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. FORM ───────────────────────────────────────────────────── */}
        <section id="inscripcion" className="py-14 px-4 sm:px-6 scroll-mt-4 bg-gray-900/40">
          <div className="max-w-md mx-auto text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Empezá hoy
            </h2>
            <p className="text-gray-400 text-sm mb-5">
              Completá el formulario y accedé al curso en minutos
            </p>
            {formattedPrice && (
              <div className="inline-block bg-gray-900 border border-gray-800 rounded-2xl px-8 py-4">
                <span className="text-3xl font-black text-white">{formattedPrice}</span>
                <span className="block text-gray-400 text-xs mt-1">Pago único · acceso inmediato</span>
              </div>
            )}
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl shadow-violet-900/10">
              <LandingInscriptionForm course={course as any} landingPage={landing as any} />
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-gray-500">
                <span>MercadoPago · Tarjetas· Transferencia</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. FAQ + FOOTER ───────────────────────────────────────────── */}
        <FaqSection />
        <PrivacyNotice />

        <footer className="border-t border-gray-900 py-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Modista App. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;

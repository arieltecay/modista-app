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
  const ctaText = landing.buttonText || 'RESERVAR MI LUGAR';

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
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 to-gray-950" />
          <div className="relative max-w-xl mx-auto px-4 sm:px-6 pt-10 pb-14 text-center">

            <span className="inline-block bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full mb-6">
              200+ alumnas ya confiaron
            </span>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-5">
              {title}
            </h1>

            {description && (
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-7">
                {description}
              </p>
            )}

            {formattedPrice && (
              <div className="mb-7">
                <span className="text-4xl sm:text-5xl font-black text-white">{formattedPrice}</span>
                <span className="block text-gray-400 text-sm mt-1">pago único · acceso inmediato</span>
              </div>
            )}

            {course.imageUrl && (
              <div className="mb-7">
                <img
                  src={getOptimizedUrl(course.imageUrl, 400, 300, 'limit')}
                  alt={course.title}
                  className="w-full max-w-[240px] mx-auto aspect-[4/3] object-contain rounded-2xl"
                  loading="eager"
                />
              </div>
            )}

            <a
              href="#inscripcion"
              className="block w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white py-5 px-4 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all active:scale-[0.98]"
            >
              <span className="block text-xs font-bold text-violet-200 tracking-[0.2em] uppercase mb-1">
                Cupos limitados
              </span>
              <span className="block text-xl font-black uppercase tracking-wide">
                {ctaText}
              </span>
              {formattedPrice && (
                <span className="block text-sm font-medium text-violet-100 mt-1">
                  Precio único: <strong className="text-white">{formattedPrice}</strong>
                </span>
              )}
            </a>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400">
              <span>🔒 Pago seguro</span>
              <span>💬 Soporte WhatsApp</span>
              <span>📥 Acceso inmediato</span>
            </div>
          </div>
        </section>

        {/* ── 2. BENEFITS ──────────────────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
              Lo que vas a llevarte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((b, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="text-3xl mb-2">{b.emoji}</div>
                  <p className="text-white font-semibold text-sm mb-1">{b.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. SOCIAL PROOF ──────────────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6 bg-gray-900/40">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center items-center gap-6 sm:gap-12 mb-10 text-center">
              {STATS.map((s, i) => (
                <div key={i}>
                  <p className="text-2xl sm:text-3xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed mb-3">"{t.text}"</p>
                  <p className="text-white text-xs font-semibold">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. FORM ──────────────────────────────────────────────────── */}
        <section id="inscripcion" className="py-14 px-4 sm:px-6 scroll-mt-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-2">
              ¿Lista para empezar?
            </h2>
            <p className="text-gray-400 text-center text-sm mb-7">
              Completá tus datos y reservá tu lugar
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl shadow-violet-900/20">
              <LandingInscriptionForm course={course as any} landingPage={landing as any} />
            </div>
          </div>
        </section>

        {/* ── 5. FAQ + FOOTER ─────────────────────────────────────────── */}
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

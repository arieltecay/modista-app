import React, { useEffect, useMemo, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { SEO, PrivacyNotice, FaqSection } from '@/components';
import { getOptimizedUrl } from '../../utils/image-utils';
import { useLandingData } from '../LandingPage/hooks/use-landing-data';
import { BENEFITS } from '../LandingPage/data';
import StitchDivider from './components/StitchDivider';
import LandingSkeleton from './components/LandingSkeleton';
import HeroSection from './sections/HeroSection';
import BenefitsSection from './sections/BenefitsSection';
import InstructorSection from './sections/InstructorSection';
import TestimonialsSection from './sections/TestimonialsSection';
import SecuritySection from './sections/SecuritySection';
import FormSection from './sections/FormSection';
import StickyCta from './sections/StickyCta';
import { useRevealOnScroll } from './hooks/use-reveal';
import { trackV2, useScrollDepthTracking } from './hooks/use-landing-tracking';

/**
 * Landing Page V2 — "Atelier Digital".
 *
 * Ruta paralela `/v2/lp/:slug`: convive con la v1 (`/lp/:slug`) sin romperla.
 * Misma data (CMS de landings + curso + testimonios vía useLandingData),
 * nuevo sistema visual, form blindado y funnel de tracking completo.
 */
const LandingPageV2: React.FC = () => {
  const { landing, course, testimonials, loading, error } = useLandingData();
  const formRef = useRef<HTMLElement | null>(null);

  const courseId = useMemo(() => course?.id || course?.uuid || course?._id, [course]);

  useRevealOnScroll();
  useScrollDepthTracking({ courseId, courseTitle: course?.title, value: course?.price });

  // Paso 1 del funnel: vista del detalle/oferta del curso
  useEffect(() => {
    if (!courseId || !course?.title) return;
    trackV2('course_detail_view', {
      courseId,
      courseTitle: course.title,
      value: course.price ? Number(course.price) : undefined,
    });
  }, [courseId, course?.title, course?.price]);

  if (loading) {
    return <LandingSkeleton />;
  }

  if (error || !landing || !course) {
    return <Navigate to="/cursos" replace />;
  }

  const title = landing.customTitle || course.title;
  const description = landing.customDescription || course.shortDescription;
  const price = {
    formatted: course.price
      ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(course.price)
      : null,
    raw: course.price,
  };
  const ctaText = landing.buttonText || 'QUIERO EMPEZAR AHORA';

  return (
    <>
      <SEO
        title={title || 'Inscripción'}
        description={description}
        ogImage={getOptimizedUrl(course.imageUrl, 1200, 630)}
      />

      <div className="min-h-screen bg-atelier-canvas text-atelier-ink antialiased">
        <StickyCta
          ctaText="Inscribirme con pago seguro"
          formRef={formRef}
          courseId={courseId}
          courseTitle={course.title}
          coursePrice={course.price}
        />

        <HeroSection
          title={title}
          description={description}
          imageUrl={course.imageUrl}
          price={price}
          ctaText={ctaText}
          isPresencial={(course as { isPresencial?: boolean }).isPresencial}
          formRef={formRef}
        />

        <StitchDivider />

        <BenefitsSection benefits={BENEFITS} />

        <InstructorSection />

        {/* Solo se renderiza si hay testimonios REALES cargados desde el CMS
            (regla de honestidad: nunca contenido inventado). */}
        {testimonials.length > 0 && (
          <>
            <StitchDivider />
            <TestimonialsSection testimonials={testimonials} />
          </>
        )}

        <StitchDivider />

        <SecuritySection />

        <FormSection ref={formRef} course={course} landing={landing} price={price} />

        <div className="bg-white">
          <FaqSection variant="light" />
        </div>
        <PrivacyNotice />

        <footer className="border-t border-atelier-sage/15 py-8 text-center bg-atelier-canvas">
          <p className="text-atelier-muted-text text-sm font-atelier-sans">
            &copy; {new Date().getFullYear()} Modista App. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </>
  );
};

export default LandingPageV2;

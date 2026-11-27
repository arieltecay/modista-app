import React, { useEffect, useMemo, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import PrivacyNotice from '../../components/PrivacyNotice';
import FaqSection from '../../components/FaqSection';
import { getOptimizedUrl } from '../../utils/image-utils';
import { useLandingData } from '../../hooks/use-landing-data';
import { BENEFITS } from './data';
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
import { trackCourseView } from '../../services/analytics';
import { useMarketingConsent } from '../../hooks/use-marketing-consent';
import { META_PIXEL_READY_EVENT } from '../../services/meta-pixel';

const CAMISAS_PRESALE_DESCRIPTION =
  'Aprendé a crear una camisa a medida y a confeccionar distintos tipos de cuellos, paso a paso y con explicaciones claras. Inscribite hoy en la preventa y el 23 de noviembre recibirás acceso completo a todas las clases grabadas, para avanzar a tu ritmo y sin vencimiento.';

/**
 * Landing Page V2 — "Atelier Digital".
 *
 * Ruta canónica `/lp/:slug` (puerta de entrada de las campañas de Meta Ads).
 * Misma data (CMS de landings + curso + testimonios vía useLandingData),
 * nuevo sistema visual, form blindado y funnel de tracking completo.
 */
const LandingPageV2: React.FC = () => {
  const { landing, course, testimonials, loading, error } = useLandingData();
  const formRef = useRef<HTMLElement | null>(null);
  const marketingConsent = useMarketingConsent();

  const courseId = useMemo(() => course?.id || course?.uuid || course?._id, [course]);

  useRevealOnScroll();
  useScrollDepthTracking({ courseId, courseTitle: course?.title, value: course?.price });

  useEffect(() => {
    if (!marketingConsent || !courseId || !course?.title) return;

    const trackLandingView = () => {
      trackCourseView(courseId, course.title, course.price);
      trackV2('course_detail_view', {
        courseId,
        courseTitle: course.title,
        value: course.price ? Number(course.price) : undefined,
      });
    };

    trackLandingView();
    window.addEventListener(META_PIXEL_READY_EVENT, trackLandingView);
    return () => window.removeEventListener(META_PIXEL_READY_EVENT, trackLandingView);
  }, [courseId, course?.title, course?.price, marketingConsent]);

  if (loading) {
    return <LandingSkeleton />;
  }

  if (error || !landing || !course) {
    return <Navigate to="/cursos" replace />;
  }

  const isCamisasPreSale = landing.slug === 'curso-online-de-camisas';
  const description = landing.customDescription || (isCamisasPreSale ? CAMISAS_PRESALE_DESCRIPTION : course.shortDescription);
  const title = landing.customTitle || course.title;
  const accessLabel = isCamisasPreSale ? 'Acceso completo desde el 23/11' : 'Acceso al finalizar la compra';
  const accessDescription = isCamisasPreSale ? 'Recibís las clases el 23/11' : 'Recibís el curso al completar el pago';
  const price = {
    formatted: course.price
      ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(course.price)
      : null,
    raw: course.price,
  };
  const ctaText = landing.buttonText || (isCamisasPreSale ? 'RESERVAR MI LUGAR EN PREVENTA' : 'QUIERO EMPEZAR AHORA');

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
          accessLabel={accessLabel}
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

        <SecuritySection accessLabel={accessLabel} accessDescription={accessDescription} />

        <FormSection
          key={courseId}
          ref={formRef}
          course={course}
          landing={landing}
          price={price}
          accessLabel={accessLabel}
          isPreSale={isCamisasPreSale}
        />

        <div className="bg-white">
          <FaqSection variant="light" />
        </div>
        <PrivacyNotice />

        <footer className="min-h-24 border-t border-atelier-sage/15 py-8 text-center bg-atelier-canvas">
          <p className="text-atelier-muted-text text-sm font-atelier-sans">
            &copy; {new Date().getFullYear()} Modista App. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </>
  );
};

export default LandingPageV2;

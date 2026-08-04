import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { SEO, PrivacyNotice, FaqSection } from '@/components';
import { getOptimizedUrl } from '../../utils/image-utils';
import { useLandingData } from './hooks/use-landing-data';
import { BENEFITS, TESTIMONIALS, STATS } from './data';
import StickyCta from './sections/sticky-cta';
import HeroSection from './sections/hero-section';
import FormSection from './sections/form-section';

const BenefitsSection = React.lazy(() => import('./sections/benefits-section'));
const InstructorSection = React.lazy(() => import('./sections/instructor-section'));
const SocialProofSection = React.lazy(() => import('./sections/social-proof-section'));
const SecuritySection = React.lazy(() => import('./sections/security-section'));

const FORM_SECTION_ID = 'inscripcion';

const LandingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#FDFBF7]">
    <div className="max-w-xl mx-auto px-5 pt-12 pb-12 text-center animate-pulse">
      <div className="h-6 w-40 bg-[#7d8c7b]/10 rounded-full mx-auto mb-8" />
      <div className="h-10 bg-[#7d8c7b]/10 rounded mb-3" />
      <div className="h-10 w-2/3 bg-[#7d8c7b]/10 rounded mx-auto mb-8" />
      <div className="w-full max-w-[320px] mx-auto aspect-[4/3] bg-[#7d8c7b]/10 rounded-2xl mb-8" />
      <div className="h-16 w-full sm:w-72 bg-[#7d8c7b]/10 rounded-full mx-auto" />
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  const { landing, course, loading, error } = useLandingData();

  if (loading) {
    return <LandingSkeleton />;
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

      <div className="min-h-screen bg-[#FDFBF7] text-[#141b2b]">

        <StickyCta
          ctaText="Inscribirme con pago seguro"
          formSectionId={FORM_SECTION_ID}
          courseId={course.id}
          courseTitle={course.title}
          coursePrice={course.price}
        />

        <HeroSection
          course={course}
          landing={landing}
          title={title}
          description={description}
          formattedPrice={formattedPrice}
          ctaText={ctaText}
          formSectionId={FORM_SECTION_ID}
        />

        <Suspense fallback={null}>
          <BenefitsSection benefits={BENEFITS} />

          <InstructorSection />

          <SocialProofSection stats={STATS} testimonials={TESTIMONIALS} />

          <SecuritySection />
        </Suspense>

        <FormSection
          course={course}
          landing={landing}
          formattedPrice={formattedPrice}
        />

        <FaqSection variant="light" />
        <PrivacyNotice />

        <footer className="border-t border-[#7d8c7b]/10 py-8 text-center bg-[#FDFBF7]">
          <p className="text-[#747872] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            &copy; {new Date().getFullYear()} Modista App. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;

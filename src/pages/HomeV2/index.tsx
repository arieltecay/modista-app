import React from 'react';
import { SEO, FaqSection } from '@/components';
import V2Layout from '../../components/V2Layout';
import HeroSection from './sections/HeroSection';
import CoursesSection from './sections/CoursesSection';
import MethodSection from './sections/MethodSection';
import TestimonialsSection from './sections/TestimonialsSection';
import AboutSection from './sections/AboutSection';
import StitchDivider from '../LandingV2/components/StitchDivider';

/**
 * Home V2 — "Atelier Digital".
 * Ruta paralela `/v2`: convive con la Home actual sin romperla.
 * El reveal-on-scroll lo provee V2Layout (cubre también contenido async).
 */
const HomeV2: React.FC = () => {
  return (
    <V2Layout>
      <SEO
        title="Modista — Academia de Costura y Diseño"
        description="Aprendé costura desde cero con Mica Guevara. Cursos online y talleres presenciales en Tucumán: moldería, alta costura y diseño de moda."
      />

      <HeroSection />

      <CoursesSection />

      <StitchDivider />

      <MethodSection />

      <TestimonialsSection />

      <StitchDivider />

      <AboutSection />

      <div className="bg-white">
        <FaqSection variant="light" />
      </div>
    </V2Layout>
  );
};

export default HomeV2;

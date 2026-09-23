import React from 'react';
import TestimonialCardV2 from '../../../../components/TestimonialCardV2';
import type { TestimonialItem } from '../../types';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

/**
 * Testimonios reales desde el CMS (admin > Testimonios), card compartida v2.
 * REGLA: si no hay testimonios, la sección NO se renderiza (nunca contenido
 * inventado). La página decide la condición antes de montar.
 */
const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 bg-atelier-canvas">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold text-center mb-2 text-atelier-ink">
          Lo que dicen las alumnas
        </h2>
        <p className="text-atelier-muted-text text-center text-sm mb-8 font-atelier-sans">
          Resultados reales de quienes ya hicieron el curso
        </p>

        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <TestimonialCardV2
              key={i}
              testimonial={{ name: t.name, description: t.text, role: t.role, avatarUrl: t.avatarUrl }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

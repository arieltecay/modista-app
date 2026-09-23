import React, { useEffect, useState } from 'react';
import { getTestimonials } from '../../../../services/testimonials/testimonialService';
import TestimonialCardV2 from '../../../../components/TestimonialCardV2';
import type { Testimonial } from '../../../../services/types';

/**
 * Testimonios reales del CMS en la Home v2 (reusa TestimonialCardV2).
 * Se oculta si no hay material — nunca contenido inventado.
 */
const TestimonialsSection: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTestimonials()
      .then((data) => !cancelled && setItems(Array.isArray(data) ? data : []))
      .catch(() => !cancelled && setItems([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="py-14 px-4 sm:px-6 bg-atelier-canvas overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <p className="text-atelier-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 text-center font-atelier-sans">
          Alumnas
        </p>
        <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold mb-10 text-center text-atelier-ink">
          Lo que dicen quienes ya cosieron
        </h2>

        <div className="space-y-4">
          {items.slice(0, 6).map((t) => (
            <TestimonialCardV2 key={t._id || t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

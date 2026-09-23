import React from 'react';
import type { Testimonial } from '../../services/types';

export interface TestimonialCardV2Props {
  testimonial: Pick<Testimonial, 'name' | 'description'> & Partial<Testimonial>;
}

/**
 * Card de testimonio "Atelier Digital" — compartida por HomeV2 y LandingV2.
 * Regla de honestidad: foto real si existe (CMS), iniciales si no.
 */
const TestimonialCardV2: React.FC<TestimonialCardV2Props> = ({ testimonial }) => (
  <figure className="reveal bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(91,114,99,0.07)] border border-atelier-sage/10">
    <div className="flex gap-0.5 mb-3" aria-label="5 de 5 estrellas">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className="text-atelier-gold text-sm">★</span>
      ))}
    </div>
    <blockquote className="text-[#444842] text-sm leading-relaxed mb-4 font-atelier-sans">
      “{testimonial.description}”
    </blockquote>
    <figcaption className="flex items-center gap-3">
      {testimonial.avatarUrl ? (
        <img
          src={testimonial.avatarUrl}
          alt={`Foto de ${testimonial.name}`}
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
          className="w-9 h-9 rounded-full object-cover border border-atelier-sage/20"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-atelier-primary/10 flex items-center justify-center text-atelier-primary text-xs font-semibold font-atelier-sans">
          {testimonial.name.charAt(0)}
        </div>
      )}
      <div>
        <p className="text-atelier-ink text-xs font-semibold font-atelier-sans">{testimonial.name}</p>
        {testimonial.role && <p className="text-atelier-muted-text text-xs font-atelier-sans">{testimonial.role}</p>}
      </div>
    </figcaption>
  </figure>
);

export default TestimonialCardV2;

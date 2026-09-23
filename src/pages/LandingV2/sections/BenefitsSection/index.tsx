import React from 'react';
import type { BenefitItem } from '../../../LandingPage/types';

interface BenefitsSectionProps {
  benefits: BenefitItem[];
}

/**
 * Beneficios del curso (contenido real, compartido con v1 mientras migramos
 * al CMS por campaña).
 */
const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => (
  <section className="py-12 px-4 sm:px-6 bg-atelier-canvas">
    <div className="max-w-2xl mx-auto">
      <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold text-center mb-3 text-atelier-ink">
        ¿Qué incluye el curso?
      </h2>
      <p className="text-atelier-muted-text text-center text-sm mb-8 max-w-md mx-auto font-atelier-sans">
        Todo lo que necesitás para empezar a coser tus propias prendas
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((b, i) => (
          <div
            key={i}
            className="reveal bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(91,114,99,0.07)] border border-atelier-sage/10"
          >
            <div className="text-3xl mb-3" aria-hidden="true">{b.emoji}</div>
            <h3 className="text-atelier-ink font-semibold text-base mb-2 font-atelier-sans">{b.title}</h3>
            <p className="text-atelier-muted-text text-sm leading-relaxed font-atelier-sans">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;

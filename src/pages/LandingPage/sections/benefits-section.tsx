import React from 'react';
import { BenefitItem } from '../types';

interface BenefitsSectionProps {
  benefits: BenefitItem[];
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <section className="py-10 px-4 sm:px-6 bg-[#FDFBF7]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-3 text-[#141b2b]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
          ¿Qué incluye el curso?
        </h2>
        <p className="text-[#747872] text-center text-sm mb-6 max-w-md mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
          Todo lo que necesitás para empezar a hacer tus propios abrigos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(81,96,80,0.06)]">
              <div className="text-3xl mb-3">{b.emoji}</div>
              <h3 className="text-[#141b2b] font-semibold text-base mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{b.title}</h3>
              <p className="text-[#747872] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
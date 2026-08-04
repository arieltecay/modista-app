import React from 'react';
import { StatItem, TestimonialItem } from '../types';

interface SocialProofSectionProps {
  stats: StatItem[];
  testimonials: TestimonialItem[];
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ stats, testimonials }) => {
  return (
    <section className="py-10 px-4 sm:px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-[#141b2b]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
          Lo que dicen las alumnas
        </h2>
        <p className="text-[#747872] text-center text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Resultados reales de quienes ya hicieron el curso
        </p>

        <div className="flex justify-center items-center gap-6 sm:gap-12 mb-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#FDFBF7] rounded-2xl px-6 py-4 min-w-[100px]">
              <p className="text-xl sm:text-2xl font-bold text-[#516050]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.value}</p>
              <p className="text-xs text-[#747872] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#FDFBF7] rounded-2xl p-5 shadow-[0_2px_12px_rgba(81,96,80,0.04)]">
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-[#444842] text-sm leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7d8c7b]/15 flex items-center justify-center text-[#516050] text-xs font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#141b2b] text-xs font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{t.name}</p>
                  <p className="text-[#747872] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
import React from 'react';

const InstructorSection: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-6 bg-[#FDFBF7]">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-[#141b2b]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
          Tu instructora
        </h2>
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(81,96,80,0.06)]">
          <div className="w-20 h-20 rounded-full bg-[#7d8c7b]/10 flex items-center justify-center mx-auto mb-5 ring-2 ring-[#7d8c7b]/20">
            <span className="text-3xl">🧵</span>
          </div>
          <h3 className="text-[#141b2b] font-semibold text-lg mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Mica Guevara</h3>
          <p className="text-[#747872] text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Instructora de costura con años de experiencia formando alumnas. Su método paso a paso te permite aprender desde cero, sin necesidad de experiencia previa.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
import React from 'react';
import { CourseData, LandingPageData } from '../types';
import { getOptimizedUrl } from '../../../utils/image-utils';
import { trackCtaClick } from '../../../services/analytics';

interface HeroSectionProps {
  course: CourseData;
  landing: LandingPageData;
  title: string;
  description: string | undefined;
  formattedPrice: string | null;
  ctaText: string;
  formSectionId: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ course, title, description, formattedPrice, ctaText, formSectionId }) => {
  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackCtaClick(ctaText, 'hero', { id: course.id, title: course.title, price: course.price });
    const formSection = document.getElementById(formSectionId);
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FDFBF7]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#7d8c7b]/10 via-[#FDFBF7] to-[#FDFBF7]" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#7d8c7b]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-[#c5a992]/10 rounded-full blur-3xl" />

      <div className="relative max-w-xl mx-auto px-5 pt-12 pb-12 text-center">
        <span className="inline-block bg-[#7d8c7b]/10 border border-[#7d8c7b]/20 text-[#516050] text-xs font-semibold px-4 py-1.5 rounded-full mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Curso online de costura
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mb-6 px-2 text-[#141b2b]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
          {title}
        </h1>

        {description && (
          <p className="text-base sm:text-lg text-[#444842] leading-relaxed mb-6 max-w-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {description}
          </p>
        )}

        {course.imageUrl && (
          <div className="mb-6">
            <img
              src={getOptimizedUrl(course.imageUrl, 500, 375)}
              alt={course.title}
              width={500}
              height={375}
              fetchPriority="high"
              decoding="async"
              className="w-full max-w-[320px] mx-auto aspect-[4/3] object-cover rounded-2xl shadow-xl"
              loading="eager"
            />
          </div>
        )}

        <a
          href={`#${formSectionId}`}
          onClick={scrollToForm}
          className="inline-flex flex-col items-center w-full sm:w-auto sm:px-20 bg-[#516050] hover:bg-[#4A5a4B] text-white py-5 px-8 rounded-full shadow-lg shadow-[#516050]/20 transition-all active:scale-[0.98]"
        >
          <span className="text-xl font-bold uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{ctaText}</span>
          {formattedPrice && (
            <span className="text-sm font-medium text-[#d7e7d3] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              <strong className="text-white">{formattedPrice}</strong> · pago único
            </span>
          )}
        </a>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#747872]" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span>🔒 Pago seguro</span>
          <span>📥 Acceso inmediato</span>
          <span>♾️ Sin vencimiento</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
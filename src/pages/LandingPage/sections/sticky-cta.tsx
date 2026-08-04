import React, { useState, useEffect, useRef } from 'react';
import { trackCtaClick, trackStickyCtaView } from '../../../services/analytics';

interface StickyCtaProps {
  ctaText: string;
  formSectionId: string;
  courseId?: string;
  courseTitle?: string;
  coursePrice?: number;
}

const StickyCta: React.FC<StickyCtaProps> = ({ ctaText, formSectionId, courseId, courseTitle, coursePrice }) => {
  const [visible, setVisible] = useState(true);
  const ticking = useRef(false);
  const viewTracked = useRef(false);
  const wasHidden = useRef(false);

  useEffect(() => {
    const formSection = document.getElementById(formSectionId);

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        if (formSection) {
          const rect = formSection.getBoundingClientRect();
          const formIsVisible = rect.top < window.innerHeight && rect.bottom > 0;
          setVisible(!formIsVisible);
          if (formIsVisible) {
            wasHidden.current = true;
          } else if (wasHidden.current && !viewTracked.current) {
            viewTracked.current = true;
            trackStickyCtaView({ id: courseId, title: courseTitle });
          }
        }
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [formSectionId, courseId, courseTitle]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackCtaClick(ctaText, 'sticky_cta', { id: courseId, title: courseTitle, price: coursePrice });
    const formSection = document.getElementById(formSectionId);
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/95 to-transparent pb-4">
      <a
        href={`#${formSectionId}`}
        onClick={handleClick}
        className="w-full bg-[#516050] hover:bg-[#4A5D4B] active:scale-[0.98] text-white py-4 px-6 rounded-full shadow-lg shadow-[#516050]/25 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-base font-semibold tracking-wide">{ctaText}</span>
      </a>
    </div>
  );
};

export default StickyCta;

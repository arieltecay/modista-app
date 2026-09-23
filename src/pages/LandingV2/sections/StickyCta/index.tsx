import React, { useEffect, useRef, useState } from 'react';
import { trackCtaClick, trackStickyCtaView } from '../../../../services/analytics';
import { trackV2 } from '../../hooks/use-landing-tracking';

interface StickyCtaProps {
  ctaText: string;
  /** Ref a la sección del form — sin selectores CSS frágiles */
  formRef: React.RefObject<HTMLElement | null>;
  courseId?: string;
  courseTitle?: string;
  coursePrice?: number;
}

/**
 * CTA fijo inferior. Se oculta mientras el formulario es visible (no molestar
 * al momento de decidir) y vuelve al scrollear. Misma lógica de v1 pero con ref.
 */
const StickyCta: React.FC<StickyCtaProps> = ({ ctaText, formRef, courseId, courseTitle, coursePrice }) => {
  const [visible, setVisible] = useState(true);
  const ticking = useRef(false);
  const viewTracked = useRef(false);
  const wasHidden = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const formSection = formRef.current;
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [formRef, courseId, courseTitle]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackCtaClick(ctaText, 'sticky_cta', { id: courseId, title: courseTitle, price: coursePrice });
    trackV2('cta_click', { courseId, courseTitle, value: coursePrice });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-atelier-canvas via-atelier-canvas/95 to-transparent pb-4">
      <a
        href="#inscripcion"
        onClick={handleClick}
        className="w-full bg-atelier-primary hover:bg-atelier-primary-dark active:scale-[0.98] text-white py-4 px-6 rounded-full shadow-lg shadow-atelier-primary/25 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-base font-semibold tracking-wide font-atelier-sans">{ctaText}</span>
      </a>
    </div>
  );
};

export default StickyCta;

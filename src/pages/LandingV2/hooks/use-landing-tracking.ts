import { useEffect } from 'react';

type FunnelStep =
  | 'course_detail_view'
  | 'cta_click'
  | 'pricing_visible'
  | 'form_view'
  | 'form_start'
  | 'form_submit'
  | 'scroll_50'
  | 'scroll_90'
  | 'redirect_to_payment'
  | 'purchase';

interface TrackExtra {
  courseId?: string;
  courseTitle?: string;
  inscriptionId?: string;
  value?: number;
}

/**
 * Wrapper seguro del funnel-tracker: dynamic import (lazy chunk) y no rompe
 * el render si el tracking falla. La landing v2 lo usa para cubrir TODOS los
 * pasos del funnel (cta_click, pricing_visible, scroll_*) que v1 no medía.
 */
export const trackV2 = (step: FunnelStep, extra: TrackExtra = {}): void => {
  import('../../../utils/funnel-tracker')
    .then(({ trackFunnel }) => trackFunnel(step, extra))
    .catch(() => {});
};

/**
 * Marca visible (una sola vez) cuando un elemento con precio entra al viewport.
 * Se engancha con data-pricing y usa IntersectionObserver.
 */
export const usePricingVisibleOnce = (ref: React.RefObject<Element | null>, extra: TrackExtra): void => {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackV2('pricing_visible', extra);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, extra.courseId]);
};

/**
 * Dispara scroll_50 / scroll_90 una vez por sesión y página.
 * rAF-throttled y pasivo (cero costo perceptible).
 */
export const useScrollDepthTracking = (extra: TrackExtra): void => {
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        if (max > 0) {
          const pct = (window.scrollY + window.innerHeight) / max * 100;
          if (pct >= 50) trackV2('scroll_50', extra);
          if (pct >= 90) trackV2('scroll_90', extra);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // trackFunnel dedupea por sesión, esto solo empuja candidatos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extra.courseId]);
};

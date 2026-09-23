import React, { useCallback } from 'react';
import { getOptimizedUrl } from '../../../../utils/image-utils';
import { trackCtaClick } from '../../../../services/analytics';
import { trackV2 } from '../../hooks/use-landing-tracking';
import type { HeroSectionProps } from './types';

/**
 * Hero de la landing v2: badge de modalidad, H1 serif editorial, imagen 4:5
 * (crop Cloudinary g_auto), CTA coral único y row de confianza.
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  imageUrl,
  price,
  ctaText,
  isPresencial,
  formRef,
}) => {
  const scrollToForm = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackCtaClick(ctaText, 'hero');
    trackV2('cta_click');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [ctaText, formRef]);

  return (
    <section className="relative overflow-hidden bg-atelier-canvas">
      {/* Texturas sutiles de atelier: halos cálidos */}
      <div className="absolute inset-0 bg-gradient-to-b from-atelier-sage/10 via-atelier-canvas to-atelier-canvas" aria-hidden="true" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-atelier-sage/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-atelier-gold/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-xl mx-auto px-5 pt-10 pb-12 text-center">
        <span className="inline-block bg-atelier-primary/10 border border-atelier-primary/25 text-atelier-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6 font-atelier-sans tracking-wide">
          {isPresencial ? 'Taller presencial de costura' : 'Curso online de costura'}
        </span>

        <h1 className="font-atelier-serif text-4xl sm:text-5xl font-semibold leading-[1.06] tracking-tight mb-5 px-1 text-atelier-ink">
          {title}
        </h1>

        {description && (
          <p className="text-base sm:text-lg text-[#444842] leading-relaxed mb-7 max-w-lg mx-auto font-atelier-sans">
            {description}
          </p>
        )}

        {imageUrl && (
          <div className="mb-7" data-pricing>
            <img
              src={getOptimizedUrl(imageUrl, 560, 700)}
              alt={title}
              width={560}
              height={700}
              fetchPriority="high"
              decoding="async"
              loading="eager"
              className="w-full max-w-[340px] mx-auto aspect-[4/5] object-cover rounded-3xl shadow-xl shadow-atelier-primary/10"
            />
          </div>
        )}

        <a
          href="#inscripcion"
          onClick={scrollToForm}
          className="group inline-flex flex-col items-center w-full sm:w-auto sm:px-16 bg-atelier-pop hover:bg-atelier-pop-dark text-white py-5 px-8 rounded-full shadow-lg shadow-atelier-pop/30 transition-all active:scale-[0.98]"
        >
          <span className="text-lg sm:text-xl font-bold uppercase tracking-wide font-atelier-sans">
            {ctaText}
          </span>
          {price.formatted && (
            <span className="text-sm font-medium text-white/85 normal-case mt-1 font-atelier-sans">
              <strong className="text-white font-bold">{price.formatted}</strong> · pago único
            </span>
          )}
        </a>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-atelier-muted-text font-atelier-sans">
          <span>🔒 Pago seguro</span>
          <span>📥 Acceso inmediato</span>
          <span>♾️ Sin vencimiento</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

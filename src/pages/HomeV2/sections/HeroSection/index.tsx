import React from 'react';
import { Link } from 'react-router-dom';
import { getOptimizedUrl } from '../../../../utils/image-utils';

const MICA_HERO_IMAGE =
  'https://res.cloudinary.com/ddfee9hht/image/upload/v1775245847/modista_app/HomeMica.jpg';

/**
 * Hero editorial de la Home v2 ("Atelier Digital").
 * Foto real de Mica (Cloudinary), claim serif grande y un único CTA coral.
 */
const HeroSection: React.FC = () => (
  <section className="relative overflow-hidden bg-atelier-canvas">
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-atelier-sage/10 rounded-full blur-3xl" aria-hidden="true" />
    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-atelier-gold/10 rounded-full blur-3xl" aria-hidden="true" />

    <div className="relative max-w-6xl mx-auto px-5 pt-14 pb-12 sm:pt-20 sm:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="text-center lg:text-left">
        <p className="inline-block bg-atelier-primary/10 border border-atelier-primary/25 text-atelier-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6 font-atelier-sans tracking-wide">
          Academia de costura · Tucumán & online
        </p>
        <h1 className="font-atelier-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.06] tracking-tight text-atelier-ink mb-5">
          Creá prendas únicas con tus propias manos
        </h1>
        <p className="text-base sm:text-lg text-[#444842] leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 font-atelier-sans">
          Cursos de costura, moldería y diseño paso a paso. Para quien empieza de cero y para quien quiere perfeccionarse.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
          <Link
            to="/cursos"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-atelier-pop hover:bg-atelier-pop-dark text-white font-bold uppercase tracking-wide text-sm sm:text-base py-4 px-10 rounded-full shadow-lg shadow-atelier-pop/25 transition-all active:scale-[0.98] font-atelier-sans"
          >
            Ver cursos disponibles
          </Link>
          <a
            href="#metodo"
            className="text-atelier-primary font-semibold text-sm underline underline-offset-4 decoration-atelier-sage/60 hover:decoration-atelier-primary font-atelier-sans"
          >
            Cómo funciona ↓
          </a>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-2 border-dashed border-atelier-sage/50" aria-hidden="true" />
        <img
          src={getOptimizedUrl(MICA_HERO_IMAGE, 640, 800)}
          alt="Mica Guevara, modista e instructora, en su taller"
          width={640}
          height={800}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="relative w-full aspect-[4/5] object-cover rounded-[2rem] shadow-xl shadow-atelier-primary/15"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;

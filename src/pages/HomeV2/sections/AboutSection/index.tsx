import React from 'react';
import { Link } from 'react-router-dom';

/** Foto real de Mica (misma del hero); crop cuadrado centrado en el rostro. */
const PROFILE_URL =
  'https://res.cloudinary.com/ddfee9hht/image/upload/f_auto,q_auto,w_520,h_520,c_fill,g_face/v1775245847/modista_app/HomeMica.jpg';

/**
 * Sobre Mica: texto real del About actual (no editado), layout editorial v2
 * con la foto de perfil real (no ícono).
 */
const AboutSection: React.FC = () => (
  <section id="sobre-mica" className="py-14 px-4 sm:px-6 bg-white">
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
      <div className="relative mx-auto w-full max-w-[260px]">
        <div className="absolute inset-0 -translate-x-3 translate-y-3 rounded-[2rem] border-2 border-dashed border-atelier-gold/50" aria-hidden="true" />
        <img
          src={PROFILE_URL}
          alt="Mica Guevara, modista de alta costura"
          width={520}
          height={520}
          loading="lazy"
          decoding="async"
          className="relative w-full aspect-square object-cover rounded-[2rem] shadow-lg shadow-atelier-primary/10"
        />
      </div>

      <div className="text-center lg:text-left">
        <p className="text-atelier-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 font-atelier-sans">
          Sobre mí
        </p>
        <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold mb-4 text-atelier-ink">
          ¡Hola! Soy Mica Guevara
        </h2>
        <p className="text-[#444842] text-sm sm:text-base leading-relaxed mb-4 font-atelier-sans">
          Modista de alta costura, creadora de contenido y apasionada por enseñar el arte de coser.
          Hoy acompaño a mujeres de todas las edades a desarrollar su creatividad y emprender con sus manos.
        </p>
        <p className="text-atelier-muted-text text-sm leading-relaxed mb-6 font-atelier-sans">
          Me emociona ver cómo una prenda bien hecha puede cambiar cómo nos sentimos. Por eso mi propósito
          es ayudarte a que te sientas segura, capaz y orgullosa de lo que creas.
        </p>
        <Link
          to="/sobre-mi"
          className="text-atelier-primary font-semibold text-sm underline underline-offset-4 decoration-atelier-sage/60 hover:decoration-atelier-primary font-atelier-sans"
        >
          Conocé mi historia →
        </Link>
      </div>
    </div>
  </section>
);

export default AboutSection;

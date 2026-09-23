import React from 'react';

/** Foto real de Mica — crop cuadrado centrado en el rostro (mismo asset del hero). */
const MICA_PHOTO_URL =
  'https://res.cloudinary.com/ddfee9hht/image/upload/f_auto,q_auto,w_300,h_300,c_fill,g_face/v1775245847/modista_app/HomeMica.jpg';

/**
 * Instructora: contenido real de Mica Guevara (mismo texto aprobado de v1,
 * con foto de perfil real — nunca un ícono genérico).
 */
const InstructorSection: React.FC = () => (
  <section className="py-12 px-4 sm:px-6 bg-white">
    <div className="max-w-xl mx-auto text-center">
      <p className="text-atelier-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 font-atelier-sans">
        Tu instructora
      </p>
      <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold mb-8 text-atelier-ink">
        Hola, soy Mica ✂️
      </h2>
      <div className="bg-atelier-canvas rounded-3xl p-8 shadow-[0_2px_16px_rgba(91,114,99,0.07)] border border-atelier-sage/10">
        <img
          src={MICA_PHOTO_URL}
          alt="Mica Guevara, instructora de costura"
          width={150}
          height={150}
          loading="lazy"
          decoding="async"
          className="w-20 h-20 rounded-full object-cover mx-auto mb-5 ring-2 ring-atelier-primary/20 shadow-md"
        />
        <h3 className="text-atelier-ink font-semibold text-lg mb-3 font-atelier-sans">Mica Guevara</h3>
        <p className="text-atelier-muted-text text-sm leading-relaxed max-w-sm mx-auto font-atelier-sans">
          Instructora de costura con años de experiencia formando alumnas. Su método paso a paso te
          permite aprender desde cero, sin necesidad de experiencia previa.
        </p>
      </div>
    </div>
  </section>
);

export default InstructorSection;

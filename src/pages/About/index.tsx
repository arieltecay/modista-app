import React from 'react';
import { SEO } from '@/components';
import { getOptimizedUrl } from '../../utils/image-utils';

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <SEO
        title="Sobre Mí"
        description="Conoce a Mica Guevara, modista de alta costura y creadora de Modista App. Pasión por la enseñanza y el arte de la costura."
      />
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center">
            <img
              src={getOptimizedUrl("https://res.cloudinary.com/ddfee9hht/image/upload/v1775245847/modista_app/HomeMica.jpg", 600, 800)}
              alt="Sobre Mí"
              className="rounded-lg shadow-lg mx-auto w-full max-w-sm h-auto object-cover"
              width="600"
              height="800"
              loading="lazy"
            />
          </div>
          <div className="md:w-1/2 md:pl-12 text-justify">
            <h2 className="text-4xl font-bold text-foreground mb-4">Sobre Mí 🧵</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              ¡Hola! Soy Mica Guevara modista de alta costura, creadora de contenido y apasionada por enseñar el arte de coser.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Desde chica encontré en la costura una forma de expresarme y con los años transformé ese amor en una profesión. Hoy acompaño a mujeres de todas las edades a desarrollar su creatividad y emprender con sus manos.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              En este espacio vas a encontrar cursos prácticos, accesibles y pensados para que puedas avanzar a tu ritmo. Ya sea que estés dando tus primeros pasos o que quieras perfeccionar tus técnicas, estas en el lugar indicado.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Me emociona ver como una prenda bien hecha puede cambiar cómo nos sentimos. Por eso mi propósito es ayudarte a que te sientas segura, capaz y orgullosa de lo que creas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
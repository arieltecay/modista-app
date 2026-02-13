import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img src="/images/HomeMica.jpeg" alt="Sobre Mí" className="rounded-lg shadow-lg mx-auto w-80 h-auto w-70 h-auto" />
          </div>
          <div className="md:w-1/2 md:pl-12 text-justify">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sobre Mí 🧵</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              ¡Hola! Soy Mica Guevara modista de alta costura, creadora de contenido y apasionada por enseñar el arte de coser.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Desde chica encontré en la costura una forma de expresarme y con los años transformé ese amor en una profesión. Hoy acompaño a mujeres de todas las edades a desarrollar su creatividad y emprender con sus manos.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              En este espacio vas a encontrar cursos prácticos, accesibles y pensados para que puedas avanzar a tu ritmo. Ya sea que estés dando tus primeros pasos o que quieras perfeccionar tus técnicas, estas en el lugar indicado.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Me emociona ver como una prenda bien hecha puede cambiar cómo nos sentimos. Por eso mi propósito es ayudarte a que te sientas segura, capaz y orgullosa de lo que creas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
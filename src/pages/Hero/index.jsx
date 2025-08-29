import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../../services/api';
import Announcement from '../../components/Announcement';

const Hero = () => {
  const initialTestimonialCount = 3;
  const [showAll, setShowAll] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (showAll) {
      setVisibleTestimonials(testimonials);
    } else {
      setVisibleTestimonials(testimonials.slice(0, initialTestimonialCount));
    }
  }, [showAll, testimonials]);

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="relative isolate overflow-hidden bg-white">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" />
      </svg>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:pb-24 sm:pt-10 lg:flex lg:px-8 lg:py-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8 lg:w-1/2">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Domina el arte de la costura y crea tu propia colección
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Aprende paso a paso a crear tus prendas desde cero, con moldería propia y técnicas de costura profesional. Transforma tu pasión en un oficio.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="#courses"
              className="rounded-md bg-[var(--color-green-600)] px-3.5 py-2.5 text-sm font-semibold text-gray-500 shadow-sm hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-green-600)]"
            >
              Ver Cursos
            </a>
            <a href="#about" className="text-sm font-semibold leading-6 text-gray-900">
              Sobre Mí <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-8 w-full sm:mt-16 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex lg:flex-none xl:ml-32 lg:w-1/2">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-xl sm:h-96 lg:h-full">
                <img
                  src="/images/maniqui.jpeg"
                  alt="Modista trabajando"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <img
                    src='/images/caricatura.jpeg'
                    alt="Diseño de moda"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <img
                    src="/images/pantalon.jpeg"
                    alt="Taller de costura"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Announcement />
      {loading && <p className="text-center text-gray-600">Cargando testimonios...</p>}
      {error && <p className="text-center text-red-600">Error al cargar testimonios: {error.message}</p>}
      {!loading && !error && testimonials.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
            Lo que dicen nuestros estudiantes
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 italic">"{testimonial.description}"</p>
                <p className="mt-4 text-right font-semibold text-gray-800">- {testimonial.name}</p>
              </div>
            ))}
          </div>
          {testimonials.length > initialTestimonialCount && (
            <div className="text-center mt-10">
              <button
                onClick={handleShowMore}
                className="rounded-md bg-[var(--color-green-600)] px-3.5 py-2.5 text-sm font-semibold text-gray-500 shadow-sm hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-green-600)]"
              >
                {showAll ? 'Mostrar menos' : 'Ver más testimonios'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Hero;

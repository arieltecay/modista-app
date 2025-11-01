import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../../services/testimonials/testimonialsServices';
import Announcement from '../../components/Announcement';
import ImagesHome from './ui-Components/ImagesHome';

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
    <div className="relative bg-white">
      <div className="ml-4 mr-4 mt-4 mb-2">
        <ImagesHome />
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

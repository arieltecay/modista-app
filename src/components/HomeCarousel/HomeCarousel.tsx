import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { carouselService } from '../../services/carouselService';
import { CarouselSlide } from '../../services/types/carousel';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getOptimizedUrl } from '../../utils/image-utils';

export const HomeCarousel: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await carouselService.getActiveSlides();
        setSlides(data);
      } catch (error) {
        console.error('Error fetching carousel slides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Siempre renderizamos el contenedor para evitar CLS
  return (
    <div className="relative group overflow-hidden bg-slate-100 h-[400px] lg:h-[600px]">
      {loading ? (
        // Skeleton / Fallback UI que mantiene el mismo espacio
        <div className="absolute inset-0 bg-slate-50 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando novedades...</p>
          </div>
        </div>
      ) : slides.length > 0 ? (
        <>
          <div className="embla h-full" ref={emblaRef}>
            <div className="embla__container h-full flex">
              {slides.map((slide, index) => (
                <div className="embla__slide flex-[0_0_100%] min-w-0 relative h-full" key={slide._id}>
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={getOptimizedUrl(slide.imageUrl, 1200, 800)} 
                      srcSet={`
                        ${getOptimizedUrl(slide.imageUrl, 600, 400)} 600w,
                        ${getOptimizedUrl(slide.imageUrl, 1200, 800)} 1200w,
                        ${getOptimizedUrl(slide.imageUrl, 1800, 1200)} 1800w
                      `}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1800px"
                      alt={slide.title} 
                      loading={index === 0 ? "eager" : "lazy"}
                      {...(index === 0 ? { fetchPriority: "high" } : {})}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center text-white">
                    <AnimatePresence mode="wait">
                      {selectedIndex === index && (
                        <div className="max-w-2xl">
                          <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-4xl lg:text-7xl font-black mb-4 tracking-tight"
                          >
                            {slide.title}
                          </motion.h2>
                          {slide.subtitle && (
                            <motion.p
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -30 }}
                              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                              className="text-lg lg:text-2xl text-slate-200 mb-8"
                            >
                              {slide.subtitle}
                            </motion.p>
                          )}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <a 
                              href={slide.link}
                              className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-xl shadow-indigo-600/30"
                            >
                              {slide.buttonText}
                            </a>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          {slides.length > 1 && (
            <>
              <button 
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`w-3 h-3 rounded-full transition-all ${i === selectedIndex ? 'bg-indigo-500 w-8' : 'bg-white/50 hover:bg-white'}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        // Si no hay slides, mostramos un fallback estático para no romper el diseño
        <div className="absolute inset-0 bg-indigo-900 flex items-center justify-center text-white p-8">
          <div className="max-w-2xl text-center">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">Cursos de Costura y Moldería</h2>
            <p className="text-lg lg:text-xl text-indigo-100 mb-8">Aprende técnicas profesionales y crea tus propias prendas desde cero.</p>
            <a href="/cursos" className="inline-flex items-center px-8 py-4 bg-white text-indigo-900 font-bold rounded-full transition-all hover:scale-105">
              Ver Cursos
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeCarousel;

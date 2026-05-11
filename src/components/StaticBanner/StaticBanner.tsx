import React, { useEffect, useState } from 'react';
import { carouselService } from '../../services/carouselService';
import { CarouselSlide } from '../../services/types/carousel';
import { motion } from 'framer-motion';
import { getOptimizedUrl } from '../../utils/image-utils';

/**
 * StaticBanner: Reemplaza al carrusel dinámico para mejorar el LCP y eliminar el CLS.
 * Carga solo la primera imagen activa con máxima prioridad.
 */
export const StaticBanner: React.FC = () => {
  const [banner, setBanner] = useState<CarouselSlide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await carouselService.getActiveSlides();
        if (data && data.length > 0) {
          setBanner(data[0]); // Tomamos solo el primero para máxima velocidad
        }
      } catch (error) {
        console.error('Error fetching banner:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  // Si no hay banner o está cargando, mostramos un esqueleto con las dimensiones correctas para evitar CLS
  if (loading || !banner) {
    return (
      <div className="relative bg-indigo-950 h-[450px] lg:h-[650px] w-full overflow-hidden flex items-center justify-center">
        {!loading && !banner ? (
          <div className="text-center text-white px-6">
             <h1 className="text-4xl lg:text-7xl font-black mb-4 tracking-tight">Academia de Costura</h1>
             <p className="text-lg lg:text-2xl text-slate-200 mb-8">Diseño y moldería profesional</p>
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-900 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <section className="relative bg-slate-900 h-[450px] lg:h-[650px] w-full overflow-hidden">
      {/* Imagen optimizada con carga prioritaria */}
      <div className="absolute inset-0">
        <picture>
          {/* Versión móvil: Imagen más pequeña para ahorrar ancho de banda y mejorar LCP */}
          <source 
            media="(max-width: 768px)" 
            srcSet={getOptimizedUrl(banner.imageUrl, 640, 480)} 
          />
          {/* Versión desktop */}
          <img 
            src={getOptimizedUrl(banner.imageUrl, 1600, 900)} 
            alt={banner.title}
            className="w-full h-full object-cover object-center"
            // Atributos clave para Cloudflare/Browser Optimization:
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {/* Overlay para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Contenido del Banner */}
      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center text-white">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl lg:text-7xl font-black mb-4 tracking-tight leading-tight"
          >
            {banner.title}
          </motion.h1>
          
          {banner.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-lg lg:text-2xl text-slate-200 mb-10 max-w-xl"
            >
              {banner.subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a 
              href={banner.link || '/cursos'}
              className="inline-flex items-center px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-2xl shadow-indigo-600/40 text-lg"
            >
              {banner.buttonText || 'Ver Cursos'}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StaticBanner;

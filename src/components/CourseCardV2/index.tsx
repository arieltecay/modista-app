import React from 'react';
import { Link } from 'react-router-dom';
import { getOptimizedUrl } from '../../utils/image-utils';
import type { HomeV2Course } from '../../pages/HomeV2/types';

export const formatPriceAr = (price: number): string =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);

interface CourseCardV2Props {
  course: HomeV2Course;
}

/**
 * Card de curso v2 — compartida por HomeV2 y CoursesV2.
 * Imagen 4:5 con crop inteligente (Cloudinary g_auto), badge "Top Ventas"
 * solo si la admin lo marcó (contenido real), chip "Presencial" si aplica.
 */
const CourseCardV2: React.FC<CourseCardV2Props> = ({ course }) => (
  <Link
    to={`/cursos/${course.id || course._id}`}
    className="group reveal"
  >
    <div className="relative">
      <img
        src={getOptimizedUrl(course.imageUrl, 480, 600)}
        alt={course.title}
        width={480}
        height={600}
        loading="lazy"
        decoding="async"
        className="w-full aspect-[4/5] object-cover rounded-2xl shadow-sm group-hover:shadow-lg group-hover:scale-[1.015] transition-all duration-300"
      />
      {course.isTopSeller && (
        <span className="absolute top-3 left-3 bg-atelier-gold text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow font-atelier-sans">
          🏆 Top Ventas
        </span>
      )}
      {course.isPresencial && (
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-atelier-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-atelier-sans">
          Presencial
        </span>
      )}
    </div>
    <div className="pt-3 px-1">
      <h3 className="font-atelier-serif text-base sm:text-lg font-semibold text-atelier-ink leading-snug mb-1 group-hover:text-atelier-primary transition-colors">
        {course.title}
      </h3>
      {course.shortDescription && (
        <p className="text-atelier-muted-text text-xs leading-relaxed line-clamp-2 mb-2 font-atelier-sans">
          {course.shortDescription}
        </p>
      )}
      <div className="flex items-baseline justify-between gap-2">
        {course.price > 0 ? (
          <span className="text-atelier-ink font-bold text-sm sm:text-base font-atelier-sans">
            {formatPriceAr(course.price)}
            <span className="block sm:inline text-atelier-muted-text font-normal text-[10px]"> pago único</span>
          </span>
        ) : (
          <span className="text-atelier-primary font-bold text-sm font-atelier-sans">Gratis</span>
        )}
        <span className="text-atelier-pop text-xs font-bold font-atelier-sans group-hover:translate-x-0.5 transition-transform">
          Ver curso →
        </span>
      </div>
    </div>
  </Link>
);

export default CourseCardV2;

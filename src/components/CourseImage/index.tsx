import React, { useState } from 'react';
import { CourseImageProps } from './types';
import { getOptimizedUrl, getBlurUpUrl, getSrcSet } from '../../utils/image-utils';

const CourseImage: React.FC<CourseImageProps> = ({
  course,
  className,
  width = 800,
  height = 600,
  priority = false,
  crop = 'fill',
  srcSetWidths,
  sizes,
}) => {
  const isFree = course.price === 0;
  const [imageLoaded, setImageLoaded] = useState(false);
  // Imagen prioritaria (LCP): se pinta directo, sin LQIP ni fundido. Un <img>
  // con opacity-0 no cuenta como LCP hasta hacerse visible, así que el fundido
  // de 500 ms se sumaba directamente al LCP.
  const blurUpUrl = priority ? '' : getBlurUpUrl(course.imageUrl);
  const srcSet = srcSetWidths ? getSrcSet(course.imageUrl, srcSetWidths, height / width, crop) : '';

  return (
    <div className="relative overflow-hidden">
      {isFree && (
        <div className="absolute top-0 left-0 bg-yellow-400 text-gray-900 font-bold text-xs uppercase px-3 py-1 rounded-br-lg z-10">
          Gratis
        </div>
      )}
      {/* LQIP blur-up placeholder (solo imágenes no prioritarias) */}
      {blurUpUrl && (
        <img
          src={blurUpUrl}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      <img
        src={getOptimizedUrl(course.imageUrl, width, height, crop)}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={`Imagen de ${course.title}`}
        className={`relative w-full h-full object-cover ${
          priority ? '' : `transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`
        } ${className}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' } : {})}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default CourseImage;

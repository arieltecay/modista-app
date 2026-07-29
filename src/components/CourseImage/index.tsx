import React, { useState } from 'react';
import { CourseImageProps } from './types';
import { getOptimizedUrl, getBlurUpUrl } from '../../utils/image-utils';

const CourseImage: React.FC<CourseImageProps> = ({ 
  course, 
  className, 
  width = 800, 
  height = 600, 
  priority = false,
  crop = 'fill'
}) => {
  const isFree = course.price === 0;
  const [imageLoaded, setImageLoaded] = useState(false);
  const blurUpUrl = getBlurUpUrl(course.imageUrl);

  return (
    <div className="relative overflow-hidden">
      {isFree && (
        <div className="absolute top-0 left-0 bg-yellow-400 text-gray-900 font-bold text-xs uppercase px-3 py-1 rounded-br-lg z-10">
          Gratis
        </div>
      )}
      {/* LQIP blur-up placeholder */}
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
        alt={`Imagen de ${course.title}`} 
        className={`relative w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        {...(priority ? { fetchPriority: "high" } : {})}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default CourseImage;

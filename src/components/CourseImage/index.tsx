import React from 'react';
import { CourseImageProps } from './types';
import { getOptimizedUrl } from '../../utils/image-utils';

const CourseImage: React.FC<CourseImageProps> = ({ 
  course, 
  className, 
  width = 600, 
  height = 400, 
  priority = false 
}) => {
  const isFree = parseFloat(course.price) === 0;

  return (
    <div className="relative">
      {isFree && (
        <div className="absolute top-0 left-0 bg-yellow-400 text-gray-900 font-bold text-xs uppercase px-3 py-1 rounded-br-lg z-10">
          Gratis
        </div>
      )}
      <img 
        src={getOptimizedUrl(course.imageUrl, width, height)} 
        alt={`Imagen de ${course.title}`} 
        className={className} 
        loading={priority ? "eager" : "lazy"}
        {...(priority ? { fetchpriority: "high" } : {})}
      />
    </div>
  );
};

export default CourseImage;

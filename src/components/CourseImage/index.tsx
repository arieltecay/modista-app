import React from 'react';
import { CourseImageProps } from './types';

const CourseImage: React.FC<CourseImageProps> = ({ course, className }) => {
  const isFree = parseFloat(course.price) === 0;

  return (
    <div className="relative">
      {isFree && (
        <div className="absolute top-0 left-0 bg-yellow-400 text-gray-900 font-bold text-xs uppercase px-3 py-1 rounded-br-lg z-10">
          Gratis
        </div>
      )}
      <img src={course.imageUrl} alt={`Imagen de ${course.title}`} className={className} />
    </div>
  );
};

export default CourseImage;

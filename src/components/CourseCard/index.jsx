import React from 'react';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/cursos/${course.id}`}>
        <img src={course.imageUrl} alt={`Imagen de ${course.title}`} className="w-full h-48 object-cover" />
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-gray-600 text-base">{course.shortDescription}</p>
        </div>
      </Link>
    </div>
  );
}

export default CourseCard;

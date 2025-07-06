import React from 'react';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <div className="flex-grow">
        <Link to={`/cursos/${course.id}`}>
          <img src={course.imageUrl} alt={`Imagen de ${course.title}`} className="w-full h-48 object-contain" />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-base">{course.shortDescription}</p>
          </div>
        </Link>
      </div>

      {/* Sección de compra */}
      <div className="px-6 pt-4 pb-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-2xl font-bold text-purple-600">${course.price}</p>
        <button
          onClick={() => alert(`Iniciando compra para: ${course.title}`)}
          className="bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition-all duration-300"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
}

export default CourseCard;

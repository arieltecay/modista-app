import React from 'react';
import { Link } from 'react-router-dom';
import CourseImage from '../CourseImage'; // Importa el nuevo componente

function CourseCard({ course }) {
  const isFree = parseFloat(course.price) === 0;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
      <div className="flex flex-col flex-grow">
        <Link to={`/cursos/${course.id}`} className="flex flex-col flex-grow">
          <CourseImage course={course} className="w-full h-48 object-cover" />
          <div className="p-6 flex-grow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-base mb-4">{course.shortDescription}</p>
          </div>
        </Link>
        <div className="p-6 pt-0 mt-auto flex flex-col items-center">
          {isFree ? (
            <span className="text-2xl font-bold text-green-600 mb-4">Gratis</span>
          ) : (
            <>
              <span className="text-2xl font-bold text-green-600 mb-4">${course.price}</span>
              <Link 
                to={`/cursos/${course.id}`}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-center transition-colors duration-200"
              >
                Ver Curso e Inscribirse
              </Link>
            </>
          )}
          <Link to={`/cursos/${course.id}`} className="mt-4 flex items-center text-green-600 hover:underline text-base font-medium">
            Ver más
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;

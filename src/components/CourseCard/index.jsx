import React from 'react';
import { Link } from 'react-router-dom';
import PaymentButton from '../PaymentButton';

function CourseCard({ course }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
      <div className="flex flex-col flex-grow">
        <Link to={`/cursos/${course.id}`}>
          <img src={course.imageUrl} alt={`Imagen de ${course.title}`} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-base mb-4">{course.shortDescription}</p>
          </div>
        </Link>
        <div className="p-6 pt-0 mt-auto flex flex-col items-center">
          <span className="text-2xl font-bold text-green-600 mb-4">${course.price}</span>
          <PaymentButton course={course} />
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

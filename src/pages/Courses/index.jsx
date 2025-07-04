import React from 'react';

const CourseCard = ({ title, description, price, image }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
    <img src={image} alt={title} className="w-full h-48 object-cover"/>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold text-purple-600">{price}</span>
        <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700 transition duration-300">Inscribirse</button>
      </div>
    </div>
  </div>
);

import React from 'react';
import { coursesData } from '../../data/courses';
import CourseCard from '../../components/CourseCard'; // Importa el componente reutilizable

function CoursesPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nuestros Cursos
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Explora nuestra oferta educativa y encuentra el curso perfecto para ti.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coursesData.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;

  const courses = [
    {
      title: 'Curso de Patronaje Básico',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price: '$49',
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Corte y Confección Avanzado',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      price: '$79',
      image: 'https://images.unsplash.com/photo-1581382575222-23405a98b6a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Diseño de Modas Digital',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      price: '$99',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Nuestros Cursos</h2>
          <p className="text-gray-600 mt-2">Explora nuestra oferta educativa y encuentra el curso perfecto para ti.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
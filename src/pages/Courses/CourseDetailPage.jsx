import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesData } from '../../data/courses';

function CourseDetailPage() {
  // 1. Obtener el ID de la URL
  const { id } = useParams();

  // 2. Buscar el curso correspondiente en nuestros datos
  const course = coursesData.find(c => c.id === id);

  // 3. Manejar el caso de que el curso no se encuentre
  if (!course) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold">Curso no encontrado</h1>
        <p className="mt-4">
          <Link to="/cursos" className="text-blue-500 hover:underline">
            Volver a la lista de cursos
          </Link>
        </p>
      </div>
    );
  }

  // 4. Mostrar la información del curso encontrado
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <Link to="/cursos" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          &larr; Volver a todos los cursos
        </Link>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={course.imageUrl} alt={`Imagen de ${course.title}`} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-700 text-lg mt-4 text-justify whitespace-pre-line">
            {course.longDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;

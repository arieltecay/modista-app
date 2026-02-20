import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import CourseLinks from '../CourseLinks';
import { CourseListMobileProps } from './types';

/**
 * Componente de lista mobile para mostrar cursos
 */
const CoursesListMobile: React.FC<CourseListMobileProps> = ({ courses, loading, handleEdit, handleDelete }) => {
  const navigate = useNavigate();
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return '';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const formatDate = (dateString: Date | string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 md:hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="md:hidden text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cursos</h3>
        <p className="text-gray-500">Aún no se han creado cursos.</p>
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {courses.map((course) => (
        <div key={course._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex space-x-4">
            {/* Imagen del curso */}
            <div className="flex-shrink-0">
              <img
                className="w-16 h-16 rounded-lg object-cover"
                src={course.imageUrl || course.image}
                alt={course.title}
              />
            </div>

            {/* Información del curso */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {course.shortDescription}
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-1 ml-2">
                  {(course.isPresencial || course.isWorkshop) && (
                    <button
                      onClick={() => navigate(`/admin/workshops/${course.uuid || course.id || course._id}/schedule`)}
                      className="p-2 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg"
                      title="Gestionar Agenda"
                    >
                      <CalendarIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit((course._id || course.id) as string)}
                    className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg"
                    title="Editar curso"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete((course._id || course.id) as string)}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                    title="Eliminar curso"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Metadatos */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {course.category || course.categoria || '-'}
                  </span>
                  {(course.isPresencial || course.isWorkshop) && (
                    <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                      PRESENCIAL
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(course.price)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(course.createdAt)}
                </span>
              </div>

              {/* Enlaces opcionales */}
              <CourseLinks course={course} variant="mobile" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesListMobile;
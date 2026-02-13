import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoursesAdmin } from '../../../../services/courses/coursesService';
import Spinner from '../../../../components/Spinner';

interface Course {
  _id: string;
  uuid?: string;
  id?: string;
  title: string;
  isPresencial: boolean;
  imageUrl: string;
  shortDescription: string;
}

const WorkshopSelectorPage: FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response: { data: Course[] } = await getCoursesAdmin(1, 100);
        // Filtrar solo los cursos presenciales (o todos si decides que todos pueden tener turnos)
        const presencialCourses: Course[] = response.data.filter(c => c.isPresencial);
        setCourses(presencialCourses);
      } catch (error: any) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner text="Cargando talleres..." /></div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al Panel General
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Gestión de Talleres Presenciales</h1>
              <p className="text-gray-500 mt-2 text-lg">Selecciona un taller para gestionar inscriptos, pagos y horarios.</p>
            </div>
            <button
              onClick={() => navigate('/admin/courses/add?type=presencial')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Nuevo Taller
            </button>
          </div>
        </header>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron talleres presenciales</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Para que un taller aparezca aquí, debe estar marcado como "Presencial" en la configuración del curso.</p>
            <button
              onClick={() => navigate('/admin/courses')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Configurar Cursos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div
                key={course._id}
                onClick={() => navigate(`/admin/workshops/${course.uuid || course.id}`)}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      Presencial
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {course.shortDescription}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Acción</span>
                      <span className="text-sm font-semibold text-gray-700">Gestionar Taller</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopSelectorPage;

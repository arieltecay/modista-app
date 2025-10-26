import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCoursesAdmin, updateCourse } from '../../../services/api';
import CourseForm from './components/CourseForm';
import toast from 'react-hot-toast';

const EditCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await getCoursesAdmin(1, 1000, null, null, null);
        const foundCourse = response.data.find(c => c._id === id);

        if (!foundCourse) {
          setError('Curso no encontrado');
          return;
        }

        // Formatear datos para el formulario
        const formattedCourse = {
          title: foundCourse.title || '',
          shortDescription: foundCourse.shortDescription || '',
          longDescription: foundCourse.longDescription || '',
          imageUrl: foundCourse.imageUrl || '',
          category: foundCourse.category || '',
          price: foundCourse.price?.toString() || '',
          deeplink: foundCourse.deeplink || '',
          videoUrl: foundCourse.videoUrl || '',
          coursePaid: foundCourse.coursePaid || '',
        };

        setCourse(formattedCourse);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Error al cargar el curso');
        toast.error('Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleSubmit = async (courseData) => {
    setIsSubmitting(true);
    try {
      await updateCourse(id, courseData);
      toast.success('Curso actualizado exitosamente');

      // Redirigir a la lista de cursos después de 2 segundos
      setTimeout(() => {
        navigate('/admin/courses');
      }, 2000);

    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.message || 'Error al actualizar el curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/admin/courses')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Editar Curso</h1>
              <p className="text-lg text-gray-500">Modifique los datos del curso según sea necesario</p>
            </div>
            <button
              onClick={() => navigate('/admin/courses')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              ← Volver a Cursos
            </button>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          {course && (
            <CourseForm
              initialData={course}
              onSubmit={handleSubmit}
              isEditing={true}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
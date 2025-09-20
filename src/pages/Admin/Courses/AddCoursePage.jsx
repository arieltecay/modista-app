import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../../services/api';
import { defaultCourseValues } from './validation/courseValidation';
import CourseForm from './components/CourseForm';
import toast from 'react-hot-toast';

/**
 * Página para agregar un nuevo curso
 */
const AddCoursePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (courseData) => {
    setIsSubmitting(true);
    try {
      await createCourse(courseData);
      toast.success('Curso creado exitosamente');

      // Redirigir a la lista de cursos después de 2 segundos
      setTimeout(() => {
        navigate('/admin/courses');
      }, 2000);

    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error.message || 'Error al crear el curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Agregar Nuevo Curso</h1>
              <p className="text-lg text-gray-500">Complete el formulario para crear un nuevo curso</p>
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
          <CourseForm
            initialData={defaultCourseValues}
            onSubmit={handleSubmit}
            isEditing={false}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
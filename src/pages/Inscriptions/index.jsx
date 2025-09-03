import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createInscription, getCourses } from '../../services/api';
import Spinner from '../../components/Spinner';
import CourseImage from '../../components/CourseImage';

const InscriptionsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setCourseLoading(true);
        const coursesData = await getCourses();
        const foundCourse = coursesData.find(c => c.id === courseId);
        setCourse(foundCourse);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setCourseLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setCourseLoading(false);
    }
  }, [courseId]);

  const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio.';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido.';
    }
    if (!formData.celular.trim()) newErrors.celular = 'El celular es obligatorio.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const inscriptionData = {
        ...formData,
        courseId: courseId || '1',
        courseTitle: course?.title || 'Curso por defecto',
        coursePrice: course?.price || 0
      };
      await createInscription(inscriptionData);
      setFormMessage({ type: 'success', text: '¡Gracias por inscribirte! Nos pondremos en contacto contigo pronto.' });
      setFormData({ nombre: '', apellido: '', email: '', celular: '' });
    } catch (error) {
      const errorMessage = error.message || 'Ocurrió un error al enviar tu inscripción. Por favor, intenta de nuevo.';
      setFormMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner text="Cargando curso..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* SECCIÓN CURSO (si existe) */}
        {course && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <CourseImage course={course} className="w-full h-64 object-contain" />
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <span className="text-2xl font-bold text-green-600 mb-4 block">${course.price}</span>
              <p className="text-gray-700 text-lg">{course.shortDescription}</p>
            </div>
          </div>
        )}

        {/* FORMULARIO INSCRIPCIÓN */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Formulario de Inscripción
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {course ? `Completa tus datos para inscribirte al curso "${course.title}"` : 'Completa tus datos para pre-inscribirte a nuestros cursos.'}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
             <div>
              <label htmlFor="nombre" className="sr-only">Nombre</label>
              <input id="nombre" name="nombre" type="text" required value={formData.nombre} onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Nombre" />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label htmlFor="apellido" className="sr-only">Apellido</label>
              <input id="apellido" name="apellido" type="text" required value={formData.apellido} onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.apellido ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Apellido" />
              {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Correo electrónico" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="celular" className="sr-only">Celular</label>
              <input id="celular" name="celular" type="tel" required value={formData.celular} onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.celular ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Número de celular" />
              {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {loading ? <Spinner /> : 'Enviar Inscripción'}
            </button>
          </div>

          {formMessage && (
            <div className={`text-center p-3 rounded-md ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {formMessage.text}
            </div>
          )}
        </form>
        </div>
      </div>
    </div>
  );
};

export default InscriptionsPage;

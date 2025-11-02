import { apiClient } from '../api';

/**
 * Obtiene la lista de todos los cursos.
 * @returns {Promise<Array<object>>} Una promesa que resuelve a un array de cursos.
 */
export const getCourses = () => apiClient.get('/courses');

/**
 * Envía un correo con el link del curso pagado.
 * @param {object} inscriptionData - Los datos de la inscripción, incluyendo email, nombre, apellido y título del curso.
 * @returns {Promise<object>} Una promesa que resuelve a la respuesta del servidor.
 */
export const sendCoursePaidEmail = async (inscriptionData: any) => {
  // Obtener el coursePaid directamente usando el endpoint específico por título
  const encodedCourseTitle = encodeURIComponent(inscriptionData.courseTitle);
  const courseResponse = await apiClient.get(`/courses/course-paid/${encodedCourseTitle}`);
  const courseData = courseResponse.data;

  if (!courseResponse?.success || !courseData?.coursePaid) {
    throw new Error('El curso no tiene un link de acceso configurado.');
  }

  const emailPayload = {
    to: inscriptionData.email,
    subject: `¡Tu curso "${courseData.courseTitle}" está listo!`,
    templateName: 'coursePaid',
    data: {
      name: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
      courseTitle: courseData.courseTitle,
      coursePaid: courseData.coursePaid,
      year: new Date().getFullYear(),
    },
  };
  return apiClient.post('/email/send-email', emailPayload);
};

/**
 * @file Servicio de API para la comunicación con el backend.
 * @module services/api
 * Utiliza una instancia centralizada de Axios para realizar peticiones HTTP.
 * Incluye interceptors para manejar las respuestas y errores de forma global.
 */
import axios from 'axios';

/**
 * Instancia de Axios pre-configurada con la URL base de la API.
 * @type {import('axios').AxiosInstance}
 */
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de requests de Axios para incluir token JWT.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de respuestas de Axios.
 * 1. Si la petición es exitosa, extrae y devuelve el `response.data`.
 * 2. Si la petición falla, busca un mensaje de error en la respuesta del backend
 *    y rechaza la promesa con ese mensaje para un manejo de errores consistente.
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  }
);

/**
 * Obtiene la lista de todos los cursos.
 * @returns {Promise<Array<object>>} Una promesa que resuelve a un array de cursos.
 */
export const getCourses = () => apiClient.get('/courses');

/**
 * Obtiene la lista de todos los testimonios.
 * @returns {Promise<Array<object>>} Una promesa que resuelve a un array de testimonios.
 */
export const getTestimonials = () => apiClient.get('/courses/testimonials');


/**
 * Registra una nueva inscripción.
 * @param {object} formData - Los datos del formulario de inscripción.
 * @returns {Promise<object>} Una promesa que resuelve al objeto de la inscripción creada.
 */
export const createInscription = (formData) =>
  apiClient.post('/inscriptions', formData);

/**
 * Obtiene una lista paginada de inscripciones.
 * @param {number} [page=1] - El número de página.
 * @param {number} [limit=10] - El número de inscripciones por página.
 * @param {string} sortBy - Campo para ordenar.
 * @param {string} sortOrder - Orden (asc/desc).
 * @param {string} search - Término de búsqueda.
 * @param {string} [paymentStatusFilter='all'] - Filtro por estado de pago ('all', 'paid', 'pending').
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con los datos de la paginación y las inscripciones.
 */
export const getInscriptions = (page = 1, limit = 10, sortBy, sortOrder, search, paymentStatusFilter = 'all') =>
  apiClient.get('/inscriptions', {
    params: { page, limit, sortBy, sortOrder, search, paymentStatusFilter },
  });

/**
 * Obtiene el recuento de inscripciones totales, pagadas y pendientes.
 * @returns {Promise<object>} Una promesa que resuelve al objeto con los recuentos.
 */
export const getInscriptionsCount = () =>
  apiClient.get('/inscriptions/count');

/**
 * Actualiza el estado de pago de una inscripción.
 * @param {string} inscriptionId - El ID de la inscripción.
 * @param {string} paymentStatus - El nuevo estado de pago ('pending' o 'paid').
 * @returns {Promise<object>} Una promesa que resuelve al objeto de la inscripción actualizada.
 */
export const updateInscriptionPaymentStatus = (inscriptionId, paymentStatus) =>
  apiClient.patch(`/inscriptions/${inscriptionId}/payment-status`, {
    paymentStatus
  });

/**
 * Envía un correo de confirmación de inscripción.
 * @param {object} inscriptionData - Los datos de la inscripción, incluyendo nombre, apellido, email y courseTitle.
 * @returns {Promise<object>} Una promesa que resuelve a la respuesta del servidor.
 */
export const sendConfirmationEmail = (inscriptionData) => {
  const emailPayload = {
    to: inscriptionData.email,
    subject: `Confirmación de tu Inscripción - ${inscriptionData.courseTitle}`,
    templateName: 'teamplate', // Usamos la plantilla general 'teamplate.html'
    data: {
      name: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
      courseTitle: inscriptionData.courseTitle,
      price: inscriptionData.coursePrice, // Corregido: de price a coursePrice
      deeplink: inscriptionData.courseDeeplink, // Corregido: de deeplink a courseDeeplink
      shortDescription: inscriptionData.courseShortDescription, // Corregido: de shortDescription a courseShortDescription
      year: inscriptionData.dateYear,
    },
  };
  return apiClient.post('/email/send-email', emailPayload);
};

/**
 * Envía un correo de confirmación de pago exitoso.
 * @param {object} inscriptionData - Los datos de la inscripción, incluyendo email, nombre, apellido y título del curso.
 * @returns {Promise<object>} Una promesa que resuelve a la respuesta del servidor.
 */
export const sendPaymentSuccessEmail = (inscriptionData) => {
  const emailPayload = {
    to: inscriptionData.email,
    subject: `¡Pago Confirmado! Tu curso "${inscriptionData.courseTitle}"`,
    templateName: 'paymentSuccess', // Usamos la nueva plantilla
    data: {
      name: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
      courseTitle: inscriptionData.courseTitle,
      year: new Date().getFullYear(),
    },
  };
  return apiClient.post('/email/send-email', emailPayload);
};

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Los datos del usuario (email, password, name, role).
 * @returns {Promise<object>} Una promesa que resuelve a la respuesta del servidor.
 */
export const registerUser = (userData) =>
  apiClient.post('/auth/register', userData);

/**
 * Inicia sesión de usuario.
 * @param {object} credentials - Las credenciales del usuario (email, password).
 * @returns {Promise<object>} Una promesa que resuelve a la respuesta del servidor con token y datos de usuario.
 */
export const loginUser = (credentials) =>
  apiClient.post('/auth/login', credentials);

/**
 * Crea un nuevo curso.
 * @param {object} courseData - Los datos del curso a crear.
 * @returns {Promise<object>} Una promesa que resuelve al curso creado.
 */
export const createCourse = (courseData) =>
  apiClient.post('/courses', courseData);

/**
 * Actualiza un curso existente.
 * @param {string} courseId - El ID del curso a actualizar.
 * @param {object} courseData - Los datos actualizados del curso.
 * @returns {Promise<object>} Una promesa que resuelve al curso actualizado.
 */
export const updateCourse = (courseId, courseData) =>
  apiClient.put(`/courses/${courseId}`, courseData);

/**
 * Elimina un curso.
 * @param {string} courseId - El ID del curso a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve a la confirmación de eliminación.
 */
export const deleteCourse = (courseId) =>
  apiClient.delete(`/courses/${courseId}`);

/**
 * Obtiene una lista paginada de cursos para admin.
 * @param {number} [page=1] - El número de página.
 * @param {number} [limit=10] - El número de cursos por página.
 * @param {string} sortBy - Campo para ordenar.
 * @param {string} sortOrder - Orden (asc/desc).
 * @param {string} search - Término de búsqueda.
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con los datos de paginación y cursos.
 */
export const getCoursesAdmin = (page = 1, limit = 10, sortBy, sortOrder, search) =>
  apiClient.get('/courses/admin', {
    params: { page, limit, sortBy, sortOrder, search },
  });

/**
 * Exporta las inscripciones a un archivo Excel.
 * Realiza una petición que espera un blob y gestiona la descarga.
 * @param {string} [paymentStatusFilter='all'] - Filtro por estado de pago ('all', 'paid', 'pending').
 * @returns {Promise<void>}
 */
export const exportInscriptions = async (paymentStatusFilter = 'all') => {
  const token = localStorage.getItem('token');

  // Usamos una instancia separada de Axios para manejar la respuesta como blob
  // sin que el interceptor global de JSON interfiera.
  const downloadClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
  });

  try {
    const response = await downloadClient.get('/inscriptions/export', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { paymentStatusFilter },
      responseType: 'blob', // ¡Muy importante para manejar archivos!
    });

    // Crear una URL para el blob y simular un clic para descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Extraer el nombre del archivo de los headers si está disponible
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'inscripciones.xlsx'; // fallback
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Limpieza
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    // Si el servidor devuelve un error en JSON (p.ej. 401 Unauthorized), 
    // el blob puede contener ese error. Necesitamos leerlo.
    if (error.response && error.response.data.type === 'application/json') {
      const errorJson = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(JSON.parse(reader.result));
        reader.readAsText(error.response.data);
      });
      throw new Error(errorJson.message || 'Error al exportar.');
    }
    throw new Error('No se pudo descargar el archivo. Verifica tu conexión y permisos.');
  }
};

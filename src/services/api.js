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
 * Crea una preferencia de pago en Mercado Pago.
 * @param {object} course - El objeto del curso.
 * @param {string} external_reference - La referencia externa para la transacción.
 * @returns {Promise<object>} Una promesa que resuelve al objeto de la preferencia de pago.
 */
export const createPreference = (course, external_reference) =>
  apiClient.post('/payment/create-preference', { course, external_reference });

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
 * @param {string} secret - El secreto para autorizar la petición.
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con los datos de la paginación y las inscripciones.
 */
export const getInscriptions = (page = 1, limit = 10, secret) =>
  apiClient.get('/inscriptions', {
    params: { page, limit, secret },
  });
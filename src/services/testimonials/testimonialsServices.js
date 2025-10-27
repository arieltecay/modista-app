import { apiClient } from '../api';

/**
 * Obtiene la lista de todos los testimonios.
 * @returns {Promise<Array<object>>} Una promesa que resuelve a un array de testimonios.
 */
export const getTestimonials = () => apiClient.get('/testimonials');

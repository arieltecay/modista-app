/**
 * @file Servicio de Testimonios
 * @module services/testimonials
 * 
 * Responsabilidades:
 * - Obtener testimonios de cursos
 * 
 * @domain Testimonials Management
 * @pattern Service Layer Pattern
 */

import { apiClient } from '../config/apiClient';
import type { Testimonial } from '../types';

/**
 * Obtiene la lista de testimonios activos.
 *
 * @param courseId - uuid del curso (opcional). Si se pasa, devuelve los
 *   testimonios específicos de ese curso más los genéricos.
 *
 * @example
 * const testimonials = await getTestimonials(course.id);
 */
export const getTestimonials = (courseId?: string): Promise<Testimonial[]> =>
    apiClient.get('/testimonials', courseId ? { params: { courseId } } : undefined);

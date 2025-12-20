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
 * Obtiene la lista de todos los testimonios.
 * 
 * @returns Una promesa que resuelve a un array de testimonios
 * 
 * @example
 * const testimonials = await getTestimonials();
 */
export const getTestimonials = (): Promise<Testimonial[]> =>
    apiClient.get('/testimonials');

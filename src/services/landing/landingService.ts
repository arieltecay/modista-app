import { apiClient } from '../config/apiClient';
import { LandingPage, ApiResponse, Testimonial } from '../types';
import type { Course } from '../courses/types';

/**
 * Obtiene la configuración de una Landing Page por su slug.
 *
 * @param slug - El identificador de la URL de la landing
 * @returns Promesa con los datos de la landing
 */
export const getLandingPageBySlug = (slug: string): Promise<ApiResponse<LandingPage>> =>
    apiClient.get(`/landings/slug/${slug}`);

export interface LandingFullData {
    landing: LandingPage;
    course: Course;
    testimonials: Testimonial[];
}

/**
 * Landing + curso + testimonios en UNA llamada. Usa `apiClient` (no `publicClient`)
 * a propósito: necesita X-Session-Id / X-Meta-Fbc / X-Meta-Fbp para el CAPI del servidor.
 */
export const getLandingFullBySlug = (slug: string): Promise<ApiResponse<LandingFullData>> =>
    apiClient.get(`/landings/slug/${slug}/full`);

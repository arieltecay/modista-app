import { apiClient } from '../config/apiClient';
import { LandingPage, ApiResponse } from '../types';

/**
 * Obtiene la configuración de una Landing Page por su slug.
 * 
 * @param slug - El identificador de la URL de la landing
 * @returns Promesa con los datos de la landing
 */
export const getLandingPageBySlug = (slug: string): Promise<ApiResponse<LandingPage>> =>
    apiClient.get(`/landings/slug/${slug}`);

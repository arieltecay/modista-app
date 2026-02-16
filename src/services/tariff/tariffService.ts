import axios from 'axios';
import { AvailableTariffMeta, TariffData } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtiene el tarifario de confección desde la API, con posibilidad de filtrar.
 * @param {string} [type] - El tipo de tarifario (e.g., "modista", "molderia").
 * @param {string} [periodIdentifier] - El identificador del período (e.g., "Noviembre 2025 a Enero 2026").
 * @returns {Promise<TariffData>} Los datos completos del tarifario.
 */
export const getTariffs = async (type?: string, periodIdentifier?: string): Promise<TariffData> => {
  try {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (periodIdentifier) params.append('periodIdentifier', periodIdentifier);

    const response = await axios.get<TariffData>(`${API_URL}/api/tariffs`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el tarifario:', error);
    throw error;
  }
};

/**
 * Obtiene los metadatos de todos los tarifarios disponibles desde la API.
 * @returns {Promise<AvailableTariffMeta[]>} Un array de metadatos de tarifarios.
 */
export const getAvailableTariffMetadata = async (): Promise<AvailableTariffMeta[]> => {
  try {
    const response = await axios.get<AvailableTariffMeta[]>(`${API_URL}/api/tariffs/meta`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los metadatos del tarifario:', error);
    throw error;
  }
};
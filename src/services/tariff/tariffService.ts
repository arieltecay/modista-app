import axios from 'axios';
import { AvailableTariffMeta, TariffData, SearchResultItem } from './types';

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

/**
 * Busca ítems dentro de un tarifario específico por texto.
 * @param {string} type - El tipo de tarifario (e.g., "modista", "costurera").
 * @param {string} periodIdentifier - El identificador del período.
 * @param {string} searchText - El texto a buscar en los ítems.
 * @returns {Promise<SearchResultItem[]>} Un array de ítems que coinciden con la búsqueda.
 */
export const searchTariffItems = async (
  type: string,
  periodIdentifier: string,
  searchText: string
): Promise<SearchResultItem[]> => {
  try {
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('periodIdentifier', periodIdentifier);
    params.append('searchText', searchText);
    const response = await axios.get<SearchResultItem[]>(`${API_URL}/api/tariffs/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al buscar ítems del tarifario:', error);
    throw error;
  }
};

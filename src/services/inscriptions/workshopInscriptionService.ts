/**
 * @file Servicio de Inscripciones de Talleres (Presencial)
 * @module services/inscriptions/workshopInscriptionService
 */

import axios from 'axios';
import { apiClient } from '../config/apiClient';
import type { Inscription, PaginatedResponse, GetInscriptionsParams } from './inscriptionService';
import type {
  WorkshopDetailsResponse,
  WorkshopInscription,
  WorkshopInscriptionData,
  WorkshopInscriptionsPaginatedResponse
} from './types';

export type {
  WorkshopDetailsResponse,
  WorkshopInscription,
  WorkshopInscriptionData,
  WorkshopInscriptionsPaginatedResponse
};

/**
 * Obtiene datos limpios y organizados del taller para la página de detalles.
 * Incluye resúmenes calculados e inscripciones agrupadas por turno.
 * @param workshopId - ID del taller/curso
 */
export const getWorkshopDetails = (
  workshopId: string
): Promise<WorkshopDetailsResponse> => {
  return apiClient.get(`/workshop-inscriptions/${workshopId}/details`) as Promise<WorkshopDetailsResponse>;
};

/**
 * Obtiene inscripciones de un taller con paginación.
 * @param workshopId - ID del taller/curso
 * @param params - Parámetros de paginación y filtrado
 */
export const getWorkshopInscriptions = (
  workshopId: string,
  params: GetInscriptionsParams
): Promise<PaginatedResponse<Inscription>> => {
  return apiClient.get(`/workshop-inscriptions/${workshopId}`, { params });
};

/**
 * Exporta inscripciones de un taller a Excel.
 * @param workshopId - ID del taller/curso
 * @param params - Filtros de exportación
 */
export const exportWorkshopInscriptions = async (
  workshopId: string,
  params: { paymentStatusFilter?: string; search?: string; turnoFilter?: string; }
): Promise<void> => {
  const token = localStorage.getItem('token');
  const downloadClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
  });

  try {
    const response = await downloadClient.get(`/workshop-inscriptions/${workshopId}/export`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition'];
    let filename = `taller_${workshopId}.xlsx`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    if (link.parentNode) link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch {
    throw new Error('Error al descargar el archivo del taller.');
  }
};

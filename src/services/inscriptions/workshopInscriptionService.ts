import { apiClient } from '../config/apiClient';
import { WorkshopDetailsResponse, WorkshopInscriptionData } from './types';
import { PaginatedResponse } from '../types';

/**
 * Fetches a list of inscriptions for a specific workshop with pagination and filters.
 * @param workshopId The ID of the workshop.
 * @param params Query parameters for filtering and pagination.
 */
export const getWorkshopInscriptions = async (workshopId: string, params: any = {}): Promise<PaginatedResponse<WorkshopInscriptionData>> => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    search,
    paymentStatusFilter = 'all',
    turnoFilter
  } = params;

  const response = await apiClient.get<PaginatedResponse<WorkshopInscriptionData>>(`/workshop-inscriptions/${workshopId}`, {
    params: {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      paymentStatusFilter,
      turnoFilter
    }
  });
  return response as any;
};

/**
 * Fetches detailed information about a specific workshop, including inscriptions grouped by turnos.
 * @param workshopId The ID of the workshop.
 * @returns A promise that resolves to WorkshopDetailsResponse.
 */
export const getWorkshopDetails = async (workshopId: string): Promise<WorkshopDetailsResponse> => {
  const response = await apiClient.get<WorkshopDetailsResponse>(`/workshop-inscriptions/${workshopId}/details`);
  return response as any;
};

/**
 * Updates the schedule of an existing inscription.
 * @param inscriptionId The ID of the inscription to update.
 * @param newTurnoId The ID of the new turno (schedule slot) to assign.
 * @returns A promise that resolves to the updated inscription data.
 */
export const updateInscriptionSchedule = async (inscriptionId: string, newTurnoId: string): Promise<WorkshopInscriptionData> => {
  const response = await apiClient.put<WorkshopInscriptionData>(`/workshop-inscriptions/${inscriptionId}/schedule`, { newTurnoId });
  return response as any;
};

/**
 * Fetches available turnos for rescheduling a specific inscription, validating capacity on the server.
 * @param inscriptionId The ID of the inscription to reschedule.
 * @returns List of available Turno objects.
 */
export const getAvailableTurnosForInscription = async (inscriptionId: string): Promise<any[]> => {
  const response = await apiClient.get<any[]>(`/workshop-inscriptions/inscription/${inscriptionId}/available-turnos`);
  return response as any;
};
// You might also want to export the InscriptionData and WorkshopDetailsResponse types
// export type { InscriptionData, WorkshopDetailsResponse };
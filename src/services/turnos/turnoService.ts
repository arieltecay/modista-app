import { apiClient } from '../config/apiClient';

interface GetTurnosOptions {
  includeBlocked?: boolean;
}

/**
 * Obtener turnos por curso
 * @param courseId ID o UUID del curso
 * @param options Opciones adicionales (ej. incluir bloqueados)
 */
export const getTurnosByCourse = (courseId: string, options: GetTurnosOptions = {}): Promise<any> => {
  const query = options.includeBlocked ? '?admin=true' : '';
  return apiClient.get(`/turnos/course/${courseId}${query}`);
};

/**
 * Crear un nuevo turno (Admin)
 */
export const createTurno = (turnoData: any) =>
  apiClient.post('/turnos', turnoData);

/**
 * Actualizar un turno (Admin)
 */
export const updateTurno = (id: string, turnoData: any) =>
  apiClient.patch(`/turnos/${id}`, turnoData);

/**
 * Eliminar un turno (Admin)
 */
export const deleteTurno = (id: string) =>
  apiClient.delete(`/turnos/${id}`);

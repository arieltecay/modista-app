import { apiClient } from '../config/apiClient';

/**
 * Obtener turnos por curso (público)
 */
export const getTurnosByCourse = (courseId: string) =>
  apiClient.get(`/turnos/course/${courseId}`);

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

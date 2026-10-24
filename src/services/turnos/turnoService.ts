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

/**
 * @file Servicio de Cursos
 * @module services/courses
 * 
 * Responsabilidades:
 * - Gestión CRUD de cursos
 * - Consultas públicas y administrativas
 * - Operaciones relacionadas con cursos
 * 
 * @domain Courses Management
 * @pattern Service Layer Pattern
 */

import { apiClient } from '../config/apiClient';
import type { PaginatedResponse } from '../types';
import type {
    Course,
    CreateCourseData,
    UpdateCourseData,
    MonthlyClosureReport
} from './types';

/**
 * Procesa el cierre mensual de un curso.
 * 
 * @param courseId - UUID del curso
 * @param closureDate - Fecha de cierre (ISO string)
 * @returns El reporte de cierre generado
 */
export const processMonthlyClosure = (courseId: string, closureDate: string): Promise<MonthlyClosureReport> =>
    apiClient.post(`/courses/${courseId}/process-closure`, { closureDate });

/**
 * Obtiene el historial de reportes de cierre mensual para un curso.
 * 
 * @param courseId - UUID del curso
 * @param page - Página
 * @param limit - Límite
 * @returns Respuesta paginada con los reportes
 */
export const getMonthlyReports = (
    courseId: string,
    page: number = 1,
    limit: number = 10
): Promise<PaginatedResponse<MonthlyClosureReport>> =>
    apiClient.get(`/courses/${courseId}/reports`, {
        params: { page, limit }
    });

/**
 * Obtiene la lista de cursos (endpoint público).
 * Soporta limitación opcional para optimizar el rendimiento.
 * 
 * @param limit - Cantidad opcional de cursos a obtener
 * @returns Array de cursos disponibles
 * 
 * @example
 * const courses = await getCourses(6);
 */
export const getCourses = (limit?: number): Promise<Course[]> =>
    apiClient.get('/courses', {
        params: { limit }
    });

/**
 * Crea un nuevo curso (requiere autenticación admin).
 * 
 * @param courseData - Datos del curso a crear
 * @returns El curso creado
 * @throws {Error} Si faltan datos requeridos o el usuario no tiene permisos
 * 
 * @example
 * const newCourse = await createCourse({
 *   title: 'Curso de React Avanzado',
 *   description: 'Aprende patrones avanzados',
 *   price: 5000
 * });
 */
export const createCourse = (courseData: CreateCourseData): Promise<Course> =>
    apiClient.post('/courses', courseData);

/**
 * Actualiza un curso existente (requiere autenticación admin).
 * 
 * @param courseId - ID del curso a actualizar
 * @param courseData - Datos actualizados del curso
 * @returns El curso actualizado
 * @throws {Error} Si el curso no existe o el usuario no tiene permisos
 * 
 * @example
 * const updated = await updateCourse('64f3b2c1e4b0a1234567890a', {
 *   price: 6000,
 *   description: 'Nueva descripción'
 * });
 */
export const updateCourse = (courseId: string, courseData: UpdateCourseData): Promise<Course> =>
    apiClient.put(`/courses/${courseId}`, courseData);

/**
 * Elimina un curso (requiere autenticación admin).
 * 
 * @param courseId - ID del curso a eliminar
 * @returns Confirmación de eliminación
 * @throws {Error} Si el curso no existe o el usuario no tiene permisos
 * 
 * @example
 * await deleteCourse('64f3b2c1e4b0a1234567890a');
 */
export const deleteCourse = (courseId: string): Promise<{ message: string }> =>
    apiClient.delete(`/courses/${courseId}`);

/**
 * Obtiene un curso por su ID o UUID.
 * 
 * @param id - ID o UUID del curso
 * @returns El objeto del curso
 */
export const getCourseById = (id: string): Promise<Course> =>
    apiClient.get(`/courses/${id}`);

/**
 * Obtiene una lista paginada de cursos para el panel admin.
 * Incluye funcionalidades de ordenamiento, búsqueda y paginación.
 * 
 * @param page - Número de página
 * @param limit - Cantidad de cursos por página
 * @param sortBy - Campo por el cual ordenar
 * @param sortOrder - Orden: 'asc' o 'desc'
 * @param search - Término de búsqueda
 * @returns Objeto con datos de paginación y cursos
 * 
 * @example
 * const { data, totalPages } = await getCoursesAdmin(1, 10, 'title', 'asc', 'React');
 */
export const getCoursesAdmin = (
    page: number = 1,
    limit: number = 10,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    search?: string
): Promise<PaginatedResponse<Course>> =>
    apiClient.get('/courses/admin', {
        params: { page, limit, sortBy, sortOrder, search },
    });

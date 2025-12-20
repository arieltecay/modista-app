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
import type {
    Course,
    CreateCourseData,
    UpdateCourseData,
    PaginatedResponse
} from '../types';

/**
 * Obtiene la lista de todos los cursos (endpoint público).
 * 
 * @returns Array de cursos disponibles
 * 
 * @example
 * const courses = await getCourses();
 */
export const getCourses = (): Promise<Course[]> =>
    apiClient.get('/courses');

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

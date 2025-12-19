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

/**
 * Obtiene la lista de todos los cursos (endpoint público).
 * 
 * @returns {Promise<Array<Object>>} Array de cursos disponibles
 * 
 * @example
 * const courses = await getCourses();
 */
export const getCourses = () => apiClient.get('/courses');

/**
 * Crea un nuevo curso (requiere autenticación admin).
 * 
 * @param {Object} courseData - Datos del curso a crear
 * @param {string} courseData.title - Título del curso
 * @param {string} courseData.description - Descripción del curso
 * @param {number} courseData.price - Precio del curso
 * @param {string} [courseData.image] - URL de la imagen del curso
 * @param {string} [courseData.deeplink] - Link del curso
 * @param {string} [courseData.coursePaid] - Link de acceso para alumnos que pagaron
 * 
 * @returns {Promise<Object>} El curso creado
 * 
 * @throws {Error} Si faltan datos requeridos o el usuario no tiene permisos
 * 
 * @example
 * const newCourse = await createCourse({
 *   title: 'Curso de React Avanzado',
 *   description: 'Aprende patrones avanzados',
 *   price: 5000
 * });
 */
export const createCourse = (courseData) =>
    apiClient.post('/courses', courseData);

/**
 * Actualiza un curso existente (requiere autenticación admin).
 * 
 * @param {string} courseId - ID del curso a actualizar
 * @param {Object} courseData - Datos actualizados del curso
 * 
 * @returns {Promise<Object>} El curso actualizado
 * 
 * @throws {Error} Si el curso no existe o el usuario no tiene permisos
 * 
 * @example
 * const updated = await updateCourse('64f3b2c1e4b0a1234567890a', {
 *   price: 6000,
 *   description: 'Nueva descripción'
 * });
 */
export const updateCourse = (courseId, courseData) =>
    apiClient.put(`/courses/${courseId}`, courseData);

/**
 * Elimina un curso (requiere autenticación admin).
 * 
 * @param {string} courseId - ID del curso a eliminar
 * 
 * @returns {Promise<Object>} Confirmación de eliminación
 * 
 * @throws {Error} Si el curso no existe o el usuario no tiene permisos
 * 
 * @example
 * await deleteCourse('64f3b2c1e4b0a1234567890a');
 */
export const deleteCourse = (courseId) =>
    apiClient.delete(`/courses/${courseId}`);

/**
 * Obtiene una lista paginada de cursos para el panel admin.
 * Incluye funcionalidades de ordenamiento, búsqueda y paginación.
 * 
 * @param {number} [page=1] - Número de página
 * @param {number} [limit=10] - Cantidad de cursos por página
 * @param {string} [sortBy] - Campo por el cual ordenar
 * @param {string} [sortOrder] - Orden: 'asc' o 'desc'
 * @param {string} [search] - Término de búsqueda
 * 
 * @returns {Promise<Object>} Objeto con datos de paginación y cursos
 * @returns {Array<Object>} return.data - Array de cursos
 * @returns {number} return.totalPages - Total de páginas
 * @returns {number} return.currentPage - Página actual
 * @returns {number} return.totalItems - Total de cursos
 * 
 * @example
 * const { data, totalPages } = await getCoursesAdmin(1, 10, 'title', 'asc', 'React');
 */
export const getCoursesAdmin = (page = 1, limit = 10, sortBy, sortOrder, search) =>
    apiClient.get('/courses/admin', {
        params: { page, limit, sortBy, sortOrder, search },
    });

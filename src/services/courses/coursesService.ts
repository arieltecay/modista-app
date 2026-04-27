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
    Course
} from './types';

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
 * Obtiene un curso por su ID o UUID.
 * 
 * @param id - ID o UUID del curso
 * @returns El objeto del curso
 */
export const getCourseById = (id: string): Promise<Course> =>
    apiClient.get(`/courses/${id}`);

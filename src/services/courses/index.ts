/**
 * Barrel export para el módulo de cursos.
 * 
 * @module services/courses
 * @pattern Facade Pattern
 */

export * from './coursesService';
export type { Course, CreateCourseData, UpdateCourseData, CourseFilters } from '../types';

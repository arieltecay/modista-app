/**
 * @file Tipos e Interfaces compartidas para todos los servicios
 * @module services/types
 */

// ============================================
// TIPOS DE DATOS DE DOMINIO
// ============================================

/**
 * Usuario del sistema
 */
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Curso
 */
export interface Course {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    deeplink?: string;
    coursePaid?: string;
    shortDescription?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Inscripción a un curso
 */
export interface Inscription {
    _id?: string;
    id?: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    courseTitle: string;
    coursePrice?: number;
    courseDeeplink?: string;
    courseShortDescription?: string;
    paymentStatus: 'pending' | 'paid';
    dateYear?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Testimonio
 */
export interface Testimonial {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    rating?: number;
    courseTitle?: string;
    createdAt?: Date;
}

// ============================================
// TIPOS DE RESPUESTAS API
// ============================================

/**
 * Respuesta genérica de la API
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * Respuesta paginada de la API
 */
export interface PaginatedResponse<T> {
    data: T[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}

/**
 * Conteo de inscripciones
 */
export interface InscriptionsCount {
    total: number;
    paid: number;
    pending: number;
}

// ============================================
// TIPOS DE PARÁMETROS
// ============================================

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

/**
 * Filtros para inscripciones
 */
export interface InscriptionFilters extends PaginationParams {
    paymentStatusFilter?: 'all' | 'paid' | 'pending';
    courseFilter?: string;
}

/**
 * Filtros para cursos
 */
export interface CourseFilters extends PaginationParams {
    // Agregar filtros específicos si es necesario
}

// ============================================
// TIPOS DE DTOs (Data Transfer Objects)
// ============================================

/**
 * Datos para crear un curso
 */
export interface CreateCourseData {
    title: string;
    description: string;
    price: number;
    image?: string;
    deeplink?: string;
    coursePaid?: string;
    shortDescription?: string;
}

/**
 * Datos para actualizar un curso
 */
export interface UpdateCourseData extends Partial<CreateCourseData> { }

/**
 * Datos para registrar un usuario
 */
export interface RegisterUserData {
    email: string;
    password: string;
    name: string;
    role?: string;
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
    token: string;
    user: User;
}

/**
 * Datos para crear una inscripción
 */
export interface CreateInscriptionData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    courseTitle: string;
    coursePrice?: number;
    courseDeeplink?: string;
    courseShortDescription?: string;
    dateYear?: number;
}

// ============================================
// TIPOS PARA EMAIL SERVICE
// ============================================

/**
 * Datos de inscripción para emails
 */
export interface InscriptionEmailData {
    email: string;
    nombre: string;
    apellido: string;
    courseTitle: string;
    coursePrice?: number;
    courseDeeplink?: string;
    courseShortDescription?: string;
    dateYear?: number;
}

/**
 * Payload genérico de email
 */
export interface EmailPayload {
    to: string;
    subject: string;
    templateName: string;
    data: Record<string, any>;
}

/**
 * Respuesta del curso pagado
 */
export interface CoursePaidResponse {
    success: boolean;
    data: {
        courseTitle: string;
        coursePaid: string;
    };
}

// ============================================
// TIPOS PARA ANALYTICS
// ============================================

/**
 * Nombres de eventos de analytics
 */
export type AnalyticsEventName =
    | 'page_view'
    | 'course_view'
    | 'button_click'
    | 'form_submit'
    | 'course_purchase'
    | 'inscription_success'
    | 'custom_event';

/**
 * Parámetros de eventos de analytics
 */
export interface EventParameters {
    [key: string]: string | number | boolean | null | undefined;
}

/**
 * Parámetros para evento de vista de curso
 */
export interface CourseViewParams extends EventParameters {
    course_id: string;
    course_title: string;
    page_location: string;
}

/**
 * Parámetros para evento de clic en botón
 */
export interface ButtonClickParams extends EventParameters {
    button_name: string;
    button_location: string;
    page_location: string;
}

/**
 * Parámetros para evento de conversión
 */
export interface ConversionParams extends EventParameters {
    value: number | null;
    currency: string;
    page_location: string;
}

// ============================================
// WINDOW EXTENSIONS
// ============================================

/**
 * Extensión del objeto Window para incluir dataLayer de GTM
 */
declare global {
    interface Window {
        dataLayer?: Array<Record<string, any>>;
    }
}

/**
 * @file Tipos e Interfaces compartidas para todos los servicios
 * @module services/types
 */

// Importamos y re-exportamos los tipos de cursos para mantener el desacoplamiento
export * from '../courses/types';

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
 * Inscripción a un curso
 */
export interface Inscription {
    id?: string;
    _id?: string;
    courseId?: string; // UUID del curso
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
    total: number;
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

// ============================================
// TIPOS DE DTOs (Data Transfer Objects)
// ============================================

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

// ============================================
// TIPOS PARA ANALYTICS
// ============================================

/**
 * Nombres de eventos de analytics extendidos
 */
export type AnalyticsEventName =
    | 'page_view'
    | 'course_view'
    | 'button_click'
    | 'form_start'
    | 'form_submit'
    | 'form_error'
    | 'inscription_success'
    | 'video_interaction'
    | 'contact_click'
    | 'external_link_click'
    | 'custom_event';

/**
 * Parámetros de eventos de analytics
 */
export interface EventParameters {
    [key: string]: string | number | boolean | null | undefined;
    user_role?: 'admin' | 'user' | 'guest';
    page_location?: string;
    timestamp?: string;
}

/**
 * Parámetros para eventos de formulario
 */
export interface FormEventParams extends EventParameters {
    form_id: string;
    form_name: string;
    field_name?: string;
    error_message?: string;
    course_id?: string;
    course_title?: string;
}

/**
 * Parámetros para evento de vista de curso
 */
export interface CourseViewParams extends EventParameters {
    course_id: string;
    course_title: string;
    course_price?: number;
    course_category?: string;
}

/**
 * Parámetros para evento de clic en botón / contacto
 */
export interface InteractionParams extends EventParameters {
    button_name: string;
    button_location: string;
    target_url?: string;
    contact_method?: 'whatsapp' | 'email' | 'phone';
}

/**
 * Parámetros para evento de video
 */
export interface VideoEventParams extends EventParameters {
    video_title: string;
    video_provider: 'youtube' | 'vimeo' | 'other';
    video_action: 'play' | 'pause' | 'complete';
}

/**
 * Parámetros para evento de conversión
 */
export interface ConversionParams extends EventParameters {
    value: number | null;
    currency: string;
    transaction_id?: string;
    course_id: string;
    course_title: string;
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

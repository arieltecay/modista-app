/**
 * @file Tipos e Interfaces específicos para el dominio de Cursos
 * @module services/courses/types
 */

/**
 * Interfaz base para un Curso
 */
export interface Course {
    id: string; // UUID (Principal)
    _id?: string; // ObjectId (Interno)
    uuid?: string; // Alias deprecado para id
    title: string;
    description: string;
    price: number;
    image?: string;
    deeplink?: string;
    coursePaid?: string;
    category?: string;
    shortDescription?: string;
    imageUrl?: string;
    isPresencial?: boolean;
    isWorkshop?: boolean;
    status?: string;
    lastMonthlyClosureDate?: Date;
    currentPaymentCycleStartDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Reporte de Cierre Mensual
 */
export interface MonthlyClosureReport {
    _id: string;
    courseId: string | Partial<Course>;
    closureDate: string;
    paymentMonth: number;
    paymentYear: number;
    totalAmountCollected: number;
    reportUrl: string;
    generatedAt: string;
}

/**
 * Datos para crear un curso (DTO)
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
 * Datos para actualizar un curso (DTO)
 */
export type UpdateCourseData = Partial<CreateCourseData>;

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

/**
 * Filtros específicos para el catálogo de cursos
 */
export interface CourseFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

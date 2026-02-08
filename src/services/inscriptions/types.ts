/**
 * @file Tipos de Inscripciones de Talleres
 * @module services/inscriptions/types
 */

// ============================================================================
// TIPOS DE RESPUESTA DEL ENDPOINT /details
// ============================================================================

/** Inscripción individual dentro de un grupo de turno */
export interface WorkshopInscriptionItem {
    _id: string;
    nombre: string;
    apellido: string;
    depositAmount: number;
    isFullPayment: boolean;
}

/** Grupo de inscripciones agrupadas por turno */
export interface TurnoGroup {
    turnoId: string;
    turnoLabel: string;
    capacity: number;
    enrolled: number;
    inscriptions: WorkshopInscriptionItem[];
}

/** Resumen estadístico del workshop */
export interface WorkshopSummary {
    totalPaidCount: number;
    depositPaidCount: number;
    totalInscriptions: number;
}

/** Respuesta del endpoint GET /workshop-inscriptions/:workshopId/details */
export interface WorkshopDetailsResponse {
    workshopTitle: string;
    workshopPrice: number;
    summary: WorkshopSummary;
    turnoGroups: TurnoGroup[];
}

// ============================================================================
// TIPOS LEGACY - Mantener por compatibilidad con otros componentes
// ============================================================================

/** Información del turno/horario del taller */
export interface TurnoInfo {
    _id: string;
    courseId: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    cupoMaximo: number;
    cuposInscriptos: number;
    isActive: boolean;
    isBlocked: boolean;
}

/** Estructura de una inscripción de taller (formato paginado) */
export interface WorkshopInscriptionData {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    celular: string;
    courseId: string;
    courseTitle: string;
    coursePrice: number;
    paymentStatus: string;
    turnoId: TurnoInfo;
    depositAmount: number;
    isReserved: boolean;
    fechaInscripcion: string;
    depositDate?: string;
}

/** Respuesta paginada del endpoint estándar */
export interface WorkshopInscriptionsPaginatedResponse {
    data: WorkshopInscriptionData[];
    total: number;
    totalPages: number;
    currentPage: number;
}

/** Interfaz legacy por compatibilidad */
export interface WorkshopInscription {
    _id: string;
    user: {
        _id: string;
        name: string;
        lastname: string;
    };
    workshop: {
        _id: string;
        name: string;
        price: number;
        date: string;
        maxCapacity: number;
    };
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentDetails?: {
        status: string;
        amount: number;
    };
}

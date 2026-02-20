/**
 * @file Tipos e interfaces del módulo de talleres (Workshops) para la capa de presentación.
 * Estos tipos son propios de la UI y están desacoplados de los modelos y payloads del backend.
 * Si el API cambia, solo se actualiza este archivo, no los componentes individuales.
 */

// ──────────────────────────────────────────────────────────────────────────────
// ENTIDADES PRINCIPALES
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Representación de un Curso que es Taller (presencial) en la vista de admin.
 */
export interface WorkshopCourse {
  _id: string;
  uuid?: string;
  id?: string;
  title: string;
  courseId?: string;
  isPresencial?: boolean;
}

/**
 * Turno / horario asignado a un taller.
 */
export interface Turno {
  _id: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo: number;
  cuposInscriptos: number;
  courseId: string;
  isBlocked: boolean;
  fecha?: string;
}

/**
 * DTO para crear un nuevo turno (sin _id asignado).
 */
export interface NewTurno {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo: number;
  courseId: string;
}

/**
 * Inscripción a un taller, incluyendo referencia al turno elegido.
 */
export interface WorkshopInscription {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  paymentStatus: 'paid' | 'pending';
  coursePrice: number;
  depositAmount: number;
  depositDate?: string;
  isReserved: boolean;
  fechaInscripcion: string;
  /** Puede ser un ID (string) o el objeto completo si el backend hace populate */
  turnoId: string | Turno;
  courseTitle: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// TIPOS DE ESTADO / UI
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Configuración de ordenamiento de tabla.
 */
export interface WorkshopSortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

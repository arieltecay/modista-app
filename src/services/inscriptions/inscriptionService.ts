/**
 * @file Servicio de Inscripciones
 * @module services/inscriptions
 * 
 * Responsabilidades:
 * - Gestión CRUD de inscripciones
 * - Exportación de datos a Excel
 * - Actualización de estados de pago
 * 
 * @domain Inscriptions Management
 * @pattern Service Layer Pattern
 */

import { apiClient } from '../config/apiClient';
import type {
    Inscription,
    CreateInscriptionData,
} from '../types';

export type {
    Inscription,
    CreateInscriptionData,
};

/**
 * Registra una nueva inscripción.
 * 
 * @param formData - Los datos del formulario de inscripción
 * @returns Una promesa que resuelve al objeto de la inscripción creada
 * 
 * @example
 * const inscription = await createInscription({
 *   nombre: 'Juan',
 *   apellido: 'Pérez',
 *   email: 'juan@example.com',
 *   telefono: '+541234567890',
 *   courseTitle: 'Curso de React'
 * });
 */
export const createInscription = (formData: CreateInscriptionData): Promise<Inscription> =>
    apiClient.post('/inscriptions', formData);
/**
 * Barrel export para el módulo de inscripciones.
 * 
 * @module services/inscriptions
 * @pattern Facade Pattern
 */

export * from './inscriptionService';
export type {
    Inscription,
    CreateInscriptionData,
    InscriptionFilters,
    InscriptionsCount
} from '../types';

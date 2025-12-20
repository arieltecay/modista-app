/**
 * Barrel export para el módulo de autenticación.
 * 
 * @module services/auth
 * @pattern Facade Pattern
 */

export * from './authService';
export type { RegisterUserData, LoginCredentials, AuthResponse } from '../types';

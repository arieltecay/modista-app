/**
 * @file Servicio de Autenticación
 * @module services/auth
 * 
 * Responsabilidades:
 * - Registro de nuevos usuarios
 * - Autenticación (login)
 * 
 * @domain Authentication & Authorization
 * @pattern Service Layer Pattern
 */

import { apiClient } from '../config/apiClient';
import type { RegisterUserData, LoginCredentials, AuthResponse } from '../types';

/**
 * Registra un nuevo usuario en el sistema.
 * 
 * @param userData - Datos del usuario a registrar
 * @returns Respuesta del servidor con datos del usuario creado
 * @throws {Error} Si el email ya está registrado o datos inválidos
 * 
 * @example
 * const response = await registerUser({
 *   email: 'usuario@ejemplo.com',
 *   password: 'Password123!',
 *   name: 'Juan Pérez'
 * });
 */
export const registerUser = (userData: RegisterUserData): Promise<AuthResponse> =>
    apiClient.post('/auth/register', userData);

/**
 * Inicia sesión de usuario.
 * 
 * @param credentials - Credenciales de acceso
 * @returns Respuesta del servidor con token JWT y datos de usuario
 * @throws {Error} Si las credenciales son incorrectas
 * 
 * @example
 * const { token, user } = await loginUser({
 *   email: 'usuario@ejemplo.com',
 *   password: 'Password123!'
 * });
 * localStorage.setItem('token', token);
 */
export const loginUser = (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post('/auth/login', credentials);

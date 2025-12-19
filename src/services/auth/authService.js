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

/**
 * Registra un nuevo usuario en el sistema.
 * 
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña
 * @param {string} userData.name - Nombre del usuario
 * @param {string} [userData.role] - Rol del usuario (opcional)
 * 
 * @returns {Promise<Object>} Respuesta del servidor con datos del usuario creado
 * 
 * @throws {Error} Si el email ya está registrado o datos inválidos
 * 
 * @example
 * const newUser = await registerUser({
 *   email: 'usuario@ejemplo.com',
 *   password: 'Password123!',
 *   name: 'Juan Pérez'
 * });
 */
export const registerUser = (userData) =>
    apiClient.post('/auth/register', userData);

/**
 * Inicia sesión de usuario.
 * 
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña
 * 
 * @returns {Promise<Object>} Respuesta del servidor con token JWT y datos de usuario
 * @returns {string} return.token - Token JWT para autenticación
 * @returns {Object} return.user - Datos del usuario autenticado
 * 
 * @throws {Error} Si las credenciales son incorrectas
 * 
 * @example
 * const { token, user } = await loginUser({
 *   email: 'usuario@ejemplo.com',
 *   password: 'Password123!'
 * });
 * localStorage.setItem('token', token);
 */
export const loginUser = (credentials) =>
    apiClient.post('/auth/login', credentials);

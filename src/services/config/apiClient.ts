/**
 * @file Configuración centralizada del cliente HTTP Axios
 * @module services/config/apiClient
 * 
 * Este módulo proporciona una instancia pre-configurada de Axios con:
 * - URL base de la API
 * - Interceptor de request para inyección automática de JWT
 * - Interceptor de response para manejo consistente de errores
 * 
 * @pattern Singleton Pattern - Una única instancia compartida
 * @principle Separation of Concerns - Configuración HTTP aislada
 */

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

/**
 * Instancia de Axios pre-configurada con la URL base de la API.
 * 
 * @constant
 * 
 * @example
 * import { apiClient } from '../config/apiClient';
 * const response = await apiClient.get('/users');
 */
export const apiClient: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor de requests de Axios.
 * Inyecta automáticamente el token JWT desde localStorage en cada petición.
 * 
 * @pattern Interceptor Pattern
 * @security Añade autorización Bearer automáticamente
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

/**
 * Interceptor de respuestas de Axios.
 * 
 * Comportamiento:
 * 1. Si la petición es exitosa → Normaliza los datos (uuid -> id) y devuelve `response.data`
 * 2. Si la petición falla → extrae mensaje de error del backend y lo rechaza
 * 
 * Esto garantiza:
 * - Respuestas consistentes (siempre `.data`)
 * - Manejo de errores predecible y uniforme
 * - Mensajes de error del backend propagados correctamente
 * - Normalización automática: El campo `uuid` se convierte en `id`
 * 
 * @pattern Chain of Responsibility
 * @error-handling Manejo centralizado de errores HTTP
 */
apiClient.interceptors.response.use(
    <T = any>(response: AxiosResponse<T>): T => {
        const data = response.data;
        return normalizeResponseData(data);
    },
    (error: AxiosError<{ message?: string }>) => {
        if (error.response?.data?.message) {
            return Promise.reject(new Error(error.response.data.message));
        }
        return Promise.reject(error);
    }
);

/**
 * Normaliza recursivamente la respuesta para asegurar que `id` sea igual a `uuid`.
 * Esto implementa la estrategia de "Single Source of Truth" en el Frontend.
 * 
 * @param data - Datos de respuesta (objeto o array)
 * @returns Datos normalizados
 */
const normalizeResponseData = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(item => normalizeResponseData(item));
    } else if (data !== null && typeof data === 'object') {
        // Si tiene 'uuid', aseguramos que 'id' sea el uuid
        if (data.uuid) {
            data.id = data.uuid;
        }
        
        // Recorrer propiedades para normalizar anidados
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (typeof data[key] === 'object' && data[key] !== null) {
                    data[key] = normalizeResponseData(data[key]);
                }
            }
        }
    }
    return data;
};

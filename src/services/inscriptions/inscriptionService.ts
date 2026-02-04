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

import axios from 'axios';
import { apiClient } from '../config/apiClient';
import type {
    Inscription,
    CreateInscriptionData,
    PaginatedResponse,
    InscriptionsCount
} from '../types';

export type {
    Inscription,
    CreateInscriptionData,
    PaginatedResponse,
    InscriptionsCount
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

/**
 * Obtiene una lista paginada de inscripciones.
 * 
 * @param page - El número de página
 * @param limit - El número de inscripciones por página
 * @param sortBy - Campo para ordenar
 * @param sortOrder - Orden (asc/desc)
 * @param search - Término de búsqueda
 * @param paymentStatusFilter - Filtro por estado de pago ('all', 'paid', 'pending')
 * @param courseFilter - Filtro por nombre del curso
 * @returns Una promesa que resuelve a un objeto con los datos de la paginación y las inscripciones
 * 
 * @example
 * const { data, totalPages } = await getInscriptions(1, 10, 'createdAt', 'desc', '', 'all');
 */
export interface GetInscriptionsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    paymentStatusFilter?: 'all' | 'paid' | 'pending';
    courseFilter?: string;
    turnoFilter?: string;
    excludeWorkshops?: boolean;
}

/**
 * Obtiene una lista paginada de inscripciones.
 */
export const getInscriptions = (params: GetInscriptionsParams): Promise<PaginatedResponse<Inscription>> => {
    const {
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
        search,
        paymentStatusFilter = 'all',
        courseFilter,
        turnoFilter,
        excludeWorkshops = false
    } = params;

    return apiClient.get('/inscriptions', {
        params: {
            page,
            limit,
            sortBy,
            sortOrder,
            search,
            paymentStatusFilter,
            courseFilter,
            turnoFilter,
            excludeWorkshops: excludeWorkshops ? 'true' : 'false'
        },
    });
};

/**
 * Obtiene el recuento de inscripciones totales, pagadas y pendientes.
 * 
 * @returns Una promesa que resuelve al objeto con los recuentos
 * 
 * @example
 * const { total, paid, pending } = await getInscriptionsCount();
 */
export const getInscriptionsCount = (excludeWorkshops?: boolean): Promise<InscriptionsCount> =>
    apiClient.get('/inscriptions/count', {
        params: { excludeWorkshops: excludeWorkshops ? 'true' : 'false' }
    });

/**
 * Actualiza el estado de pago de una inscripción.
 * 
 * @param inscriptionId - El ID de la inscripción
 * @param paymentStatus - El nuevo estado de pago ('pending' o 'paid')
 * @returns Una promesa que resuelve al objeto de la inscripción actualizada
 * 
 * @example
 * const updated = await updateInscriptionPaymentStatus('64f3b2c1...', 'paid');
 */
export const updateInscriptionPaymentStatus = (
    inscriptionId: string,
    paymentStatus: 'pending' | 'paid'
): Promise<Inscription> =>
    apiClient.patch(`/inscriptions/${inscriptionId}/payment-status`, {
        paymentStatus
    });

/**
 * Actualiza el monto de la seña de una inscripción.
 * 
 * @param inscriptionId - El ID de la inscripción
 * @param depositAmount - El monto de la seña
 * @returns Una promesa que resuelve al objeto de la inscripción actualizada
 */
export const updateInscriptionDeposit = (
    inscriptionId: string,
    depositAmount: number
): Promise<Inscription> =>
    apiClient.patch(`/inscriptions/${inscriptionId}/deposit`, {
        depositAmount
    });

/**
 * Exporta inscripciones a un archivo Excel.
 * Descarga automáticamente el archivo en el navegador.
 * 
 * @param paymentStatusFilter - Filtro por estado de pago
 * @param search - Término de búsqueda
 * @param courseFilter - Filtro por nombre del curso
 * @throws {Error} Si no se puede descargar el archivo o hay errores de permisos
 * 
 * @example
 * await exportInscriptions('paid', 'Juan', 'React');
 */
export const exportInscriptions = async (
    paymentStatusFilter: 'all' | 'paid' | 'pending' = 'all',
    search?: string,
    courseFilter?: string,
    excludeWorkshops?: boolean
): Promise<void> => {
    const token = localStorage.getItem('token');

    // Usamos una instancia separada de Axios para manejar la respuesta como blob
    // sin que el interceptor global de JSON interfiera.
    const downloadClient = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/api`,
    });

    try {
        const response = await downloadClient.get('/inscriptions/export', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { paymentStatusFilter, search, courseFilter, excludeWorkshops: excludeWorkshops ? 'true' : 'false' },
            responseType: 'blob', // ¡Muy importante para manejar archivos!
        });

        // Crear una URL para el blob y simular un clic para descargar
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Extraer el nombre del archivo de los headers si está disponible
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'inscripciones.xlsx'; // fallback

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Limpieza
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);

    } catch (error: any) {
        // Si el servidor devuelve un error en JSON (p.ej. 401 Unauthorized), 
        // el blob puede contener ese error. Necesitamos leerlo.
        if (error.response?.data?.type === 'application/json') {
            const errorJson: any = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(JSON.parse(result));
                };
                reader.readAsText(error.response.data);
            });
            throw new Error(errorJson.message || 'Error al exportar.');
        }
        throw new Error('No se pudo descargar el archivo. Verifica tu conexión y permisos.');
    }
};

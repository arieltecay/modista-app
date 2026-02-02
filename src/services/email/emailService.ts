/**
 * @file Servicio de Email
 * @module services/email
 * 
 * Servicio transversal para gestión centralizada de emails.
 * Maneja todos los tipos de notificaciones por correo.
 * 
 * @domain Cross-Cutting Concern
 * @pattern Service Layer Pattern
 * @responsibility Centralización de lógica de templates y envío de emails
 */

import { apiClient } from '../config/apiClient';
import type { InscriptionEmailData, EmailPayload, CoursePaidResponse } from '../types';

/**
 * Envía un correo de confirmación de inscripción.
 * 
 * @param inscriptionData - Datos de la inscripción
 * @returns Respuesta del servidor
 * @template teamplate.html
 * 
 * @example
 * await sendConfirmationEmail({
 *   email: 'alumno@ejemplo.com',
 *   nombre: 'Juan',
 *   apellido: 'Pérez',
 *   courseTitle: 'Curso de React',
 *   coursePrice: 5000,
 *   courseDeeplink: 'https://...',
 *   courseShortDescription: 'Aprende React desde cero'
 * });
 */
export const sendConfirmationEmail = (inscriptionData: InscriptionEmailData): Promise<{ message: string }> => {
    const emailPayload: EmailPayload = {
        to: inscriptionData.email,
        subject: `Confirmación de tu Inscripción - ${inscriptionData.courseTitle}`,
        templateName: 'teamplate', // Template general
        data: {
            name: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
            courseTitle: inscriptionData.courseTitle,
            price: inscriptionData.coursePrice,
            deeplink: inscriptionData.courseDeeplink,
            shortDescription: inscriptionData.courseShortDescription,
            year: inscriptionData.dateYear,
        },
    };
    return apiClient.post('/email/send-email', emailPayload);
};

/**
 * Envía un correo de confirmación de pago exitoso.
 * 
 * @param inscriptionData - Datos de la inscripción
 * @returns Respuesta del servidor
 * @template paymentSuccess.html
 * 
 * @example
 * await sendPaymentSuccessEmail({
 *   email: 'alumno@ejemplo.com',
 *   nombre: 'Juan',
 *   apellido: 'Pérez',
 *   courseTitle: 'Curso de React'
 * });
 */
export const sendPaymentSuccessEmail = (inscriptionData: InscriptionEmailData): Promise<{ message: string }> => {
    const turno = (inscriptionData as any).turnoId;
    let details = '';
    if (turno) {
        details = `${turno.diaSemana} de ${turno.horaInicio} a ${turno.horaFin} hs`;
    }

    const emailPayload: EmailPayload = {
        to: inscriptionData.email,
        subject: `¡Confirmación de tu lugar! ${inscriptionData.courseTitle}`,
        templateName: 'paymentSuccess',
        data: {
            name: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
            courseTitle: inscriptionData.courseTitle,
            details: details,
            year: new Date().getFullYear(),
        },
    };
    return apiClient.post('/email/send-email', emailPayload);
};

/**
 * Envía un correo con el link del curso pagado.
 * 
 * Obtiene primero el link del curso desde el backend y luego envía el email.
 * 
 * @param inscriptionData - Datos de la inscripción
 * @returns Respuesta del servidor
 * @throws {Error} Si el curso no tiene un link de acceso configurado
 * @template coursePaid.html
 * 
 * @example
 * await sendCoursePaidEmail({
 *   email: 'alumno@ejemplo.com',
 *   nombre: 'Juan',
 *   apellido: 'Pérez',
 *   courseTitle: 'Curso de React'
 * });
 */
export const sendCoursePaidEmail = async (inscriptionData: InscriptionEmailData): Promise<{ message: string }> => {
    // Obtener el coursePaid directamente usando el endpoint específico por título
    const encodedCourseTitle = encodeURIComponent(inscriptionData.courseTitle);

    // El interceptor de apiClient retorna directamente response.data
    // Por lo tanto, courseData es CoursePaidResponse, no AxiosResponse<CoursePaidResponse>
    const courseData = await apiClient.get(`/courses/course-paid/${encodedCourseTitle}`) as CoursePaidResponse;

    if (!courseData?.success || !courseData?.data?.coursePaid) {
        throw new Error('El curso no tiene un link de acceso configurado.');
    }

    const turno = (inscriptionData as any).turnoId;
    let details = '';
    if (turno) {
        details = `${turno.diaSemana} de ${turno.horaInicio} a ${turno.horaFin} hs`;
    }

    const emailPayload: EmailPayload = {
        to: inscriptionData.email,
        subject: `¡Felicidades! Estás inscripto en "${courseData.data.courseTitle}"`,
        templateName: 'coursePaid',
        data: {
            name: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
            courseTitle: courseData.data.courseTitle,
            coursePaid: courseData.data.coursePaid,
            details: details,
            year: new Date().getFullYear(),
        },
    };

    return apiClient.post('/email/send-email', emailPayload);
};

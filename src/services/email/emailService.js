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

/**
 * Envía un correo de confirmación de inscripción.
 * 
 * @param {Object} inscriptionData - Datos de la inscripción
 * @param {string} inscriptionData.email - Email del destinatario
 * @param {string} inscriptionData.nombre - Nombre del inscripto
 * @param {string} inscriptionData.apellido - Apellido del inscripto
 * @param {string} inscriptionData.courseTitle - Título del curso
 * @param {number} inscriptionData.coursePrice - Precio del curso
 * @param {string} inscriptionData.courseDeeplink - Link del curso
 * @param {string} inscriptionData.courseShortDescription - Descripción corta
 * @param {number} inscriptionData.dateYear - Año actual
 * 
 * @returns {Promise<Object>} Respuesta del servidor
 * 
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
export const sendConfirmationEmail = (inscriptionData) => {
    const emailPayload = {
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
 * @param {Object} inscriptionData - Datos de la inscripción
 * @param {string} inscriptionData.email - Email del destinatario
 * @param {string} inscriptionData.nombre - Nombre del inscripto
 * @param {string} inscriptionData.apellido - Apellido del inscripto
 * @param {string} inscriptionData.courseTitle - Título del curso
 * 
 * @returns {Promise<Object>} Respuesta del servidor
 * 
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
export const sendPaymentSuccessEmail = (inscriptionData) => {
    const emailPayload = {
        to: inscriptionData.email,
        subject: `¡Pago Confirmado! Tu curso "${inscriptionData.courseTitle}"`,
        templateName: 'paymentSuccess',
        data: {
            name: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
            courseTitle: inscriptionData.courseTitle,
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
 * @param {Object} inscriptionData - Datos de la inscripción
 * @param {string} inscriptionData.email - Email del destinatario
 * @param {string} inscriptionData.nombre - Nombre del inscripto
 * @param {string} inscriptionData.apellido - Apellido del inscripto
 * @param {string} inscriptionData.courseTitle - Título del curso
 * 
 * @returns {Promise<Object>} Respuesta del servidor
 * 
 * @throws {Error} Si el curso no tiene un link de acceso configurado
 * 
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
export const sendCoursePaidEmail = async (inscriptionData) => {
    // Obtener el coursePaid directamente usando el endpoint específico por título
    const encodedCourseTitle = encodeURIComponent(inscriptionData.courseTitle);
    const courseResponse = await apiClient.get(`/courses/course-paid/${encodedCourseTitle}`);
    const courseData = courseResponse.data;

    if (!courseResponse?.success || !courseData?.coursePaid) {
        throw new Error('El curso no tiene un link de acceso configurado.');
    }

    const emailPayload = {
        to: inscriptionData.email,
        subject: `¡Tu curso "${courseData.courseTitle}" está listo!`,
        templateName: 'coursePaid',
        data: {
            name: `${inscriptionData.nombre} ${inscriptionData.apellido}`,
            courseTitle: courseData.courseTitle,
            coursePaid: courseData.coursePaid,
            year: new Date().getFullYear(),
        },
    };
    return apiClient.post('/email/send-email', emailPayload);
};

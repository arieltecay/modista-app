/**
 * @file Servicio de Analytics para Google Tag Manager
 * @module services/analytics
 * 
 * Permite enviar eventos personalizados desde el código React a GTM
 * 
 * @pattern Observer Pattern
 */

import type {
    AnalyticsEventName,
    EventParameters,
    CourseViewParams,
    ButtonClickParams,
    ConversionParams
} from './types';

/**
 * Envía eventos a Google Tag Manager
 * 
 * @param eventName - Nombre del evento
 * @param parameters - Parámetros adicionales del evento
 * 
 * @example
 * sendAnalyticsEvent('page_view', { page_title: 'Inicio' });
 */
export const sendAnalyticsEvent = (
    eventName: AnalyticsEventName | string,
    parameters: EventParameters = {}
): void => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...parameters,
            timestamp: new Date().toISOString()
        });
        console.log(`📊 Evento enviado a GTM: ${eventName}`, parameters);
    } else {
        console.warn('⚠️ GTM no está disponible. Evento no enviado:', eventName, parameters);
    }
};

/**
 * Eventos predefinidos para la aplicación Modista
 */
export const AnalyticsEvents = {
    // Eventos de navegación
    PAGE_VIEW: 'page_view' as const,
    COURSE_VIEW: 'course_view' as const,

    // Eventos de interacción
    BUTTON_CLICK: 'button_click' as const,
    FORM_SUBMIT: 'form_submit' as const,

    // Eventos de conversión
    COURSE_PURCHASE: 'course_purchase' as const,
    INSCRIPTION_SUCCESS: 'inscription_success' as const,

    // Eventos personalizados
    CUSTOM_EVENT: 'custom_event' as const
} as const;

/**
 * Tipo de eventos de analytics basado en el objeto AnalyticsEvents
 */
export type AnalyticsEventType = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];

/**
 * Función helper para eventos de cursos
 * 
 * @param courseId - ID del curso
 * @param courseTitle - Título del curso
 * 
 * @example
 * trackCourseView('123', 'Curso de React');
 */
export const trackCourseView = (courseId: string, courseTitle: string): void => {
    const params: CourseViewParams = {
        course_id: courseId,
        course_title: courseTitle,
        page_location: window.location.href
    };
    sendAnalyticsEvent(AnalyticsEvents.COURSE_VIEW, params);
};

/**
 * Función helper para clics en botones
 * 
 * @param buttonName - Nombre del botón
 * @param buttonLocation - Ubicación del botón en la página
 * 
 * @example
 * trackButtonClick('Inscribirse', 'Hero Section');
 */
export const trackButtonClick = (buttonName: string, buttonLocation: string): void => {
    const params: ButtonClickParams = {
        button_name: buttonName,
        button_location: buttonLocation,
        page_location: window.location.href
    };
    sendAnalyticsEvent(AnalyticsEvents.BUTTON_CLICK, params);
};

/**
 * Función helper para conversiones
 * 
 * @param conversionType - Tipo de conversión
 * @param value - Valor de la conversión
 * @param currency - Moneda (por defecto ARS)
 * 
 * @example
 * trackConversion('course_purchase', 5000, 'ARS');
 */
export const trackConversion = (
    conversionType: string,
    value: number | null = null,
    currency: string = 'ARS'
): void => {
    const params: ConversionParams = {
        value,
        currency,
        page_location: window.location.href
    };
    sendAnalyticsEvent(conversionType, params);
};

/**
 * Export por defecto con todas las funciones
 */
export default {
    sendAnalyticsEvent,
    AnalyticsEvents,
    trackCourseView,
    trackButtonClick,
    trackConversion
};

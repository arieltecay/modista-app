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
    InteractionParams,
    ConversionParams,
    FormEventParams,
    VideoEventParams
} from './types';

/**
 * Obtiene el rol del usuario desde el almacenamiento local
 */
const getUserRole = (): 'admin' | 'user' | 'guest' => {
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            return user.role || 'user';
        }
    } catch (e) {
        console.error('Error al obtener el rol del usuario para analytics', e);
    }
    return 'guest';
};

/**
 * Envía eventos a Google Tag Manager
 * 
 * @param eventName - Nombre del evento
 * @param parameters - Parámetros adicionales del evento
 */
export const sendAnalyticsEvent = (
    eventName: AnalyticsEventName | string,
    parameters: EventParameters = {}
): void => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        // Bloquear eventos en el panel de administración
        if (window.location.pathname.startsWith('/admin')) {
            return;
        }

        const fullParameters = {
            ...parameters,
            user_role: getUserRole(),
            page_location: window.location.href,
            timestamp: new Date().toISOString()
        };

        window.dataLayer.push({
            event: eventName,
            ...fullParameters
        });

        // Solo loguear en desarrollo
        if (import.meta.env.DEV) {
            console.log(`📊 GTM Event: ${eventName}`, fullParameters);
        }
    }
};

/**
 * Eventos predefinidos para la aplicación Modista
 */
export const AnalyticsEvents = {
    PAGE_VIEW: 'page_view' as const,
    COURSE_VIEW: 'course_view' as const,
    BUTTON_CLICK: 'button_click' as const,
    FORM_START: 'form_start' as const,
    FORM_SUBMIT: 'form_submit' as const,
    FORM_ERROR: 'form_error' as const,
    INSCRIPTION_SUCCESS: 'inscription_success' as const,
    VIDEO_INTERACTION: 'video_interaction' as const,
    FAQ_INTERACTION: 'faq_interaction' as const,
    CONTACT_CLICK: 'contact_click' as const,
    EXTERNAL_LINK: 'external_link_click' as const
} as const;

/**
 * Tracking de interacción con FAQ
 */
export const trackFaqInteraction = (questionTitle: string, action: 'expand' | 'collapse'): void => {
    const params: InteractionParams = {
        button_name: `FAQ: ${questionTitle}`,
        button_location: 'FaqSection',
        faq_question: questionTitle,
        faq_action: action
    };
    sendAnalyticsEvent(AnalyticsEvents.FAQ_INTERACTION, params);
};

/**
 * Tracking de vista de curso
 */
export const trackCourseView = (courseId: string, courseTitle: string, price?: number): void => {
    const params: CourseViewParams = {
        course_id: courseId,
        course_title: courseTitle,
        course_price: price
    };
    sendAnalyticsEvent(AnalyticsEvents.COURSE_VIEW, params);
};

/**
 * Tracking de inicio de formulario (Intención)
 */
export const trackFormStart = (formId: string, formName: string, courseId?: string, courseTitle?: string): void => {
    const params: FormEventParams = {
        form_id: formId,
        form_name: formName,
        course_id: courseId,
        course_title: courseTitle
    };
    sendAnalyticsEvent(AnalyticsEvents.FORM_START, params);
};

/**
 * Tracking de error en formulario (Fricción)
 */
export const trackFormError = (formId: string, formName: string, fieldName: string, errorMessage: string): void => {
    const params: FormEventParams = {
        form_id: formId,
        form_name: formName,
        field_name: fieldName,
        error_message: errorMessage
    };
    sendAnalyticsEvent(AnalyticsEvents.FORM_ERROR, params);
};

/**
 * Tracking de éxito en formulario (Conversión)
 */
export const trackInscriptionSuccess = (courseId: string, courseTitle: string, value: number): void => {
    const params: ConversionParams = {
        course_id: courseId,
        course_title: courseTitle,
        value: value,
        currency: 'ARS'
    };
    sendAnalyticsEvent(AnalyticsEvents.INSCRIPTION_SUCCESS, params);
};

/**
 * Tracking de interacción con video
 */
export const trackVideoInteraction = (videoTitle: string, action: 'play' | 'pause' | 'complete'): void => {
    const params: VideoEventParams = {
        video_title: videoTitle,
        video_provider: 'youtube',
        video_action: action
    };
    sendAnalyticsEvent(AnalyticsEvents.VIDEO_INTERACTION, params);
};

/**
 * Tracking de clics de contacto (WhatsApp, etc)
 */
export const trackContactClick = (method: 'whatsapp' | 'email', location: string): void => {
    const params: InteractionParams = {
        button_name: `Contact via ${method}`,
        button_location: location,
        contact_method: method
    };
    sendAnalyticsEvent(AnalyticsEvents.CONTACT_CLICK, params);
};

/**
 * Tracking de clics en botones generales
 */
export const trackButtonClick = (buttonName: string, buttonLocation: string): void => {
    const params: InteractionParams = {
        button_name: buttonName,
        button_location: buttonLocation
    };
    sendAnalyticsEvent(AnalyticsEvents.BUTTON_CLICK, params);
};

export default {
    sendAnalyticsEvent,
    AnalyticsEvents,
    trackCourseView,
    trackFormStart,
    trackFormError,
    trackInscriptionSuccess,
    trackVideoInteraction,
    trackFaqInteraction,
    trackContactClick,
    trackButtonClick
};

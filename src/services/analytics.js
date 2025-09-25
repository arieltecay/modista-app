/**
 * Servicio de Analytics para Google Tag Manager
 * Permite enviar eventos personalizados desde el código React
 */

// Función para enviar eventos a GTM
export const sendAnalyticsEvent = (eventName, parameters = {}) => {
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

// Eventos predefinidos para la aplicación Modista
export const AnalyticsEvents = {
  // Eventos de navegación
  PAGE_VIEW: 'page_view',
  COURSE_VIEW: 'course_view',

  // Eventos de interacción
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',

  // Eventos de conversión
  COURSE_PURCHASE: 'course_purchase',
  INSCRIPTION_SUCCESS: 'inscription_success',

  // Eventos personalizados
  CUSTOM_EVENT: 'custom_event'
};

// Función helper para eventos de cursos
export const trackCourseView = (courseId, courseTitle) => {
  sendAnalyticsEvent(AnalyticsEvents.COURSE_VIEW, {
    course_id: courseId,
    course_title: courseTitle,
    page_location: window.location.href
  });
};

// Función helper para clics en botones
export const trackButtonClick = (buttonName, buttonLocation) => {
  sendAnalyticsEvent(AnalyticsEvents.BUTTON_CLICK, {
    button_name: buttonName,
    button_location: buttonLocation,
    page_location: window.location.href
  });
};

// Función helper para conversiones
export const trackConversion = (conversionType, value = null, currency = 'ARS') => {
  sendAnalyticsEvent(conversionType, {
    value: value,
    currency: currency,
    page_location: window.location.href
  });
};

export default {
  sendAnalyticsEvent,
  AnalyticsEvents,
  trackCourseView,
  trackButtonClick,
  trackConversion
};
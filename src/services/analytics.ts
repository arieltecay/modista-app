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
  FormEventParams
} from './types';
import { hasMarketingConsent } from '../utils/privacy-consent';
import {
  trackMetaInitiateCheckout,
  trackMetaLead,
  trackMetaPurchase,
  trackMetaViewContent,
  type MetaPixelTrack,
} from './meta-pixel';

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

const getMetaPixel = (): MetaPixelTrack | undefined => window.fbq as MetaPixelTrack | undefined;

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
  if (!hasMarketingConsent()) return;

  // Bloquear eventos en el panel de administración
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return;
  }

  const fullParameters = {
    ...parameters,
    user_role: getUserRole(),
    page_location: window.location.href,
    timestamp: new Date().toISOString()
  };

  // Solo enviar a GTM si no estamos en desarrollo
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...fullParameters
      });
    }
  }

  // Siempre loguear en desarrollo para debugging, pero no enviar a GTM
  if (import.meta.env.DEV) {
    console.log(`📊 [DEV] Analytics Event: ${eventName}`, fullParameters);
  }
};

/**
 * Eventos predefinidos para la aplicación Modista
 */
export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view' as const,
  COURSE_VIEW: 'course_view' as const,
  BUTTON_CLICK: 'button_click' as const,
  CTA_CLICK: 'cta_click' as const,
  STICKY_CTA_VIEW: 'sticky_cta_view' as const,
  FORM_START: 'form_start' as const,
  FORM_SUBMIT: 'form_submit' as const,
  FORM_ERROR: 'form_error' as const,
  FORM_FIELD_FOCUS: 'form_field_focus' as const,
  INSCRIPTION_SUCCESS: 'inscription_success' as const,
  PURCHASE: 'purchase' as const,
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
  const analyticsDedupeKey = `analytics_course_view_${courseId}`;
  try {
    if (!sessionStorage.getItem(analyticsDedupeKey)) {
      sendAnalyticsEvent(AnalyticsEvents.COURSE_VIEW, params);
      sessionStorage.setItem(analyticsDedupeKey, '1');
    }
  } catch {
    sendAnalyticsEvent(AnalyticsEvents.COURSE_VIEW, params);
  }

  // Meta Pixel: ViewContent
  if (hasMarketingConsent() && import.meta.env.PROD && typeof window !== 'undefined' && window.fbq) {
    const sessionId = localStorage.getItem('modista_session_id');
    if (!sessionId) return;
    trackMetaViewContent({
      consentGranted: true,
      fbq: getMetaPixel(),
      courseId,
      courseTitle,
      sessionId,
      value: price || 0,
      dedupeStore: sessionStorage,
    });
  }
};

/**
 * Tracking de inicio de formulario (Intención)
 */
export const trackFormStart = (formId: string, formName: string, courseId?: string, courseTitle?: string, inscriptionId?: string, value?: number): void => {
  const params: FormEventParams = {
    form_id: formId,
    form_name: formName,
    course_id: courseId,
    course_title: courseTitle
  };
  sendAnalyticsEvent(AnalyticsEvents.FORM_START, params);

  // Meta Pixel: InitiateCheckout (opcional, pero buena práctica)
  if (hasMarketingConsent() && import.meta.env.PROD && typeof window !== 'undefined' && inscriptionId) {
    trackMetaInitiateCheckout({
      consentGranted: true,
      fbq: getMetaPixel(),
      inscriptionId,
      courseId,
      courseTitle: courseTitle || 'Curso',
      value: value || 0,
    });
  }
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

export const trackEnrollmentDiagnostic = (stage: 'validation_failed' | 'submitted' | 'created' | 'api_failed' | 'response_invalid' | 'checkout_unavailable' | 'payment_redirect_attempt' | 'analytics_failed'): void => {
  try {
    if (typeof window !== 'undefined' && hasMarketingConsent()) {
      window.clarity?.('event', `enrollment_${stage}`);
    }
  } catch {
    // Un script de medición nunca debe bloquear la inscripción o el checkout.
  }
};

/**
 * Tracking de éxito en formulario (Conversión)
 * Envía datos a GTM y Meta Pixel
 */
export const trackInscriptionSuccess = async (
  courseId: string, 
  courseTitle: string, 
  value: number,
  inscriptionId?: string
): Promise<void> => {
  const params: ConversionParams = {
    course_id: courseId,
    course_title: courseTitle,
    value: value,
    currency: 'ARS',
    transaction_id: inscriptionId
  };
  
  // 1. Enviar a GTM / DataLayer
  sendAnalyticsEvent(AnalyticsEvents.INSCRIPTION_SUCCESS, params);

  // 2. Meta Pixel: Lead
  if (hasMarketingConsent() && import.meta.env.PROD && typeof window !== 'undefined' && inscriptionId) {
    trackMetaLead({
      consentGranted: true,
      fbq: getMetaPixel(),
      inscriptionId,
      courseId,
      courseTitle,
      value,
    });
    await new Promise<void>(resolve => setTimeout(resolve, 600));
  }

  return Promise.resolve();
};

const purchaseFallback = new Set<string>();

const hasTrackedPurchase = (key: string): boolean => {
  try {
    return sessionStorage.getItem(key) === '1' || purchaseFallback.has(key);
  } catch {
    return purchaseFallback.has(key);
  }
};

const markPurchaseTracked = (key: string): void => {
  try {
    sessionStorage.setItem(key, '1');
  } catch {
    purchaseFallback.add(key);
  }
};

/** Registra cada canal una vez cuando está listo para recibir la compra. */
export const trackPurchaseSuccess = (
  inscriptionId: string,
  courseTitle: string,
  value: number,
  courseId?: string
): void => {
  if (!import.meta.env.PROD || typeof window === 'undefined' || !hasMarketingConsent()) return;

  // Previous releases used one marker for both channels.
  if (hasTrackedPurchase(`purchase_fired_${inscriptionId}`)) return;

  const analyticsKey = `purchase_gtm_${inscriptionId}`;
  if (window.dataLayer && !hasTrackedPurchase(analyticsKey)) {
    const params: ConversionParams = {
      transaction_id: inscriptionId,
      course_id: '',
      course_title: courseTitle,
      value,
      currency: 'ARS'
    };
    sendAnalyticsEvent(AnalyticsEvents.PURCHASE, params);
    markPurchaseTracked(analyticsKey);
  }

  const pixelKey = `meta_pixel_purchase_${inscriptionId}`;
  if (hasTrackedPurchase(pixelKey)) return;
  const invoked = trackMetaPurchase({
    consentGranted: true,
    fbq: getMetaPixel(),
    inscriptionId,
    courseId,
    courseTitle,
    value,
  });
  if (invoked) markPurchaseTracked(pixelKey);
};

/**
 * Tracking de foco en campos del formulario (Fricción)
 */
export const trackFormFieldFocus = (formId: string, formName: string, fieldName: string): void => {
  const params: FormEventParams = {
    form_id: formId,
    form_name: formName,
    field_name: fieldName
  };
  sendAnalyticsEvent(AnalyticsEvents.FORM_FIELD_FOCUS, params);
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

const getScrollDepthPct = (): number => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (max <= 0) return 100;
  return Math.min(100, Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100));
};

/**
 * Tracking de clic en CTAs de conversión (hero, sticky, etc.)
 */
export const trackCtaClick = (
  buttonName: string,
  section: string,
  course?: { id?: string; title?: string; price?: number }
): void => {
  const params: InteractionParams = {
    button_name: buttonName,
    button_location: section,
    section,
    scroll_depth_pct: getScrollDepthPct()
  };
  if (course) {
    params.course_id = course.id;
    params.course_title = course.title;
    params.course_price = course.price;
  }
  sendAnalyticsEvent(AnalyticsEvents.CTA_CLICK, params);
};

/**
 * Tracking de impresión del CTA sticky (primera vez que aparece tras scroll)
 */
export const trackStickyCtaView = (course?: { id?: string; title?: string }): void => {
  const params: EventParameters = {
    section: 'sticky_cta'
  };
  if (course) {
    params.course_id = course.id;
    params.course_title = course.title;
  }
  sendAnalyticsEvent(AnalyticsEvents.STICKY_CTA_VIEW, params);
};

export default {
  sendAnalyticsEvent,
  AnalyticsEvents,
  trackCourseView,
  trackFormStart,
  trackFormError,
  trackFormFieldFocus,
  trackInscriptionSuccess,
  trackPurchaseSuccess,
  trackFaqInteraction,
  trackContactClick,
  trackCtaClick,
  trackStickyCtaView
};

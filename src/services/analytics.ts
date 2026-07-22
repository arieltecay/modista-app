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

type FbqTrack = (
  cmd: string,
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
) => void;

async function sha256(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const hashBuf = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

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

    // Integración con Meta Pixel (fbq)
    if (window.fbq) {
      // Mapeo básico de eventos de GTM a Meta Pixel si es necesario
      // Pero preferimos usar trackCourseView e trackInscriptionSuccess específicos abajo
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
  sendAnalyticsEvent(AnalyticsEvents.COURSE_VIEW, params);

  // Meta Pixel: ViewContent
  if (import.meta.env.PROD && typeof window !== 'undefined' && window.fbq) {
    const eventId = `view_content_${courseId}`;
    (window.fbq as FbqTrack)('track', 'ViewContent', {
      content_name: courseTitle,
      content_ids: [courseId],
      content_type: 'product',
      value: price || 0,
      currency: 'ARS'
    }, { eventID: eventId });
    
    // Y a DataLayer
    window.dataLayer?.push({ event: 'view_content', event_id: eventId, course_id: courseId });
  }
};

/**
 * Tracking de inicio de formulario (Intención)
 */
export const trackFormStart = (formId: string, formName: string, courseId?: string, courseTitle?: string, inscriptionId?: string): void => {
  const params: FormEventParams = {
    form_id: formId,
    form_name: formName,
    course_id: courseId,
    course_title: courseTitle
  };
  sendAnalyticsEvent(AnalyticsEvents.FORM_START, params);

  // Meta Pixel: InitiateCheckout (opcional, pero buena práctica)
  if (import.meta.env.PROD && typeof window !== 'undefined' && window.fbq) {
    (window.fbq as FbqTrack)('track', 'InitiateCheckout', {
      content_name: courseTitle,
      content_category: 'Courses',
      content_ids: [courseId]
    }, inscriptionId ? { eventID: `checkout_${inscriptionId}` } : undefined);
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

/**
 * Tracking de éxito en formulario (Conversión)
 * Envía datos a GTM y Meta Pixel
 */
export const trackInscriptionSuccess = async (
  courseId: string, 
  courseTitle: string, 
  value: number,
  email?: string,
  phone?: string,
  inscriptionId?: string
): Promise<void> => {
  const params: ConversionParams = {
    course_id: courseId,
    course_title: courseTitle,
    value: value,
    currency: 'ARS',
    transaction_id: inscriptionId,
    user_email: email,
    user_phone: phone
  };
  
  // 1. Enviar a GTM / DataLayer
  sendAnalyticsEvent(AnalyticsEvents.INSCRIPTION_SUCCESS, params);

  // 2. Meta Pixel: Lead
  if (import.meta.env.PROD && typeof window !== 'undefined' && window.fbq) {
    // Usamos una promesa para dar tiempo al Pixel de procesar
    return new Promise(async (resolve) => {
      const hash = async (s?: string) => s ? await sha256(s.trim().toLowerCase()) : undefined;
      const hashedEmail = await hash(email);
      const hashedPhone = await hash(phone);

      (window.fbq as FbqTrack)('track', 'Lead', {
        content_name: courseTitle,
        value: value,
        currency: 'ARS',
        em: hashedEmail,
        ph: hashedPhone
      }, inscriptionId ? { eventID: `lead_${inscriptionId}` } : undefined);
      
      // Meta Pixel no tiene callback nativo de finalización garantizado en todas las versiones
      // así que usamos un pequeño timeout de seguridad para asegurar que el evento se encole
      setTimeout(resolve, 600);
    });
  }

  return Promise.resolve();
};

/**
 * Tracking de compra confirmada (pago aprobado por MercadoPago)
 * Se dispara una única vez por inscripción por sesión (dedupe con sessionStorage).
 * Google Ads además deduplica server-side por transaction_id.
 */
export const trackPurchaseSuccess = (
  inscriptionId: string,
  courseTitle: string,
  value: number
): void => {
  const dedupeKey = `purchase_fired_${inscriptionId}`;
  try {
    if (sessionStorage.getItem(dedupeKey)) return;
    sessionStorage.setItem(dedupeKey, '1');
  } catch {
    // sessionStorage no disponible: se envía igual, dedupe queda a cargo de transaction_id
  }

  const params: ConversionParams = {
    transaction_id: inscriptionId,
    course_id: '',
    course_title: courseTitle,
    value,
    currency: 'ARS'
  };
  sendAnalyticsEvent(AnalyticsEvents.PURCHASE, params);
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
  trackFormFieldFocus,
  trackInscriptionSuccess,
  trackPurchaseSuccess,
  trackVideoInteraction,
  trackFaqInteraction,
  trackContactClick,
  trackButtonClick
};

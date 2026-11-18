export const META_PIXEL_READY_EVENT = 'modista:meta-pixel-ready';

type MetaEventKind = 'view_content' | 'checkout' | 'lead' | 'purchase';

export type MetaPixelTrack = (
  command: 'track',
  eventName: 'ViewContent' | 'InitiateCheckout' | 'Lead' | 'Purchase',
  customData: Record<string, unknown>,
  options: { eventID: string },
) => void;

interface MetaTrackingBase {
  consentGranted: boolean;
  fbq?: MetaPixelTrack;
}

interface MetaCommerceEvent extends MetaTrackingBase {
  courseTitle: string;
  value: number;
}

interface MetaViewContentEvent extends MetaCommerceEvent {
  courseId: string;
  sessionId: string;
  dedupeStore?: Pick<Storage, 'getItem' | 'setItem'>;
}

interface MetaInscriptionEvent extends MetaCommerceEvent {
  inscriptionId: string;
  courseId?: string;
}

export const buildMetaEventId = (
  kind: MetaEventKind,
  id: string,
  sessionId?: string,
): string => {
  if (kind !== 'view_content') return `${kind}_${id}`;
  const sessionPrefix = sessionId?.slice(0, 8);
  return sessionPrefix ? `${kind}_${id}_${sessionPrefix}` : `${kind}_${id}`;
};

export const trackMetaViewContent = (event: MetaViewContentEvent): boolean => {
  if (!event.consentGranted || !event.fbq || !event.sessionId) return false;
  const eventId = buildMetaEventId('view_content', event.courseId, event.sessionId);
  const dedupeKey = `meta_pixel_${eventId}`;
  if (event.dedupeStore?.getItem(dedupeKey)) return false;

  event.fbq('track', 'ViewContent', {
    content_name: event.courseTitle,
    content_ids: [event.courseId],
    content_type: 'product',
    value: event.value,
    currency: 'ARS',
  }, { eventID: eventId });
  event.dedupeStore?.setItem(dedupeKey, '1');
  return true;
};

export const trackMetaInitiateCheckout = (event: MetaInscriptionEvent): boolean => {
  if (!event.consentGranted || !event.fbq) return false;
  event.fbq('track', 'InitiateCheckout', {
    content_name: event.courseTitle,
    content_category: 'Courses',
    content_ids: event.courseId ? [event.courseId] : undefined,
    value: event.value,
    currency: 'ARS',
  }, { eventID: buildMetaEventId('checkout', event.inscriptionId) });
  return true;
};

export const trackMetaLead = (event: MetaInscriptionEvent): boolean => {
  if (!event.consentGranted || !event.fbq) return false;
  event.fbq('track', 'Lead', {
    content_name: event.courseTitle,
    value: event.value,
    currency: 'ARS',
  }, { eventID: buildMetaEventId('lead', event.inscriptionId) });
  return true;
};

export const trackMetaPurchase = (event: MetaInscriptionEvent): boolean => {
  if (!event.consentGranted || !event.fbq) return false;
  event.fbq('track', 'Purchase', {
    content_name: event.courseTitle,
    content_ids: event.courseId ? [event.courseId] : undefined,
    content_type: 'product',
    value: event.value,
    currency: 'ARS',
    order_id: event.inscriptionId,
  }, { eventID: buildMetaEventId('purchase', event.inscriptionId) });
  return true;
};

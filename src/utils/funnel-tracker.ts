import { getStoredUTMData } from './utm-tracking';
import { apiClient } from '../services/config/apiClient';
import { hasMarketingConsent } from './privacy-consent';
import { buildMetaEventId } from '../services/meta-pixel';
import { trackAcquisitionEvent } from './acquisition';
import { acquisitionEventFor } from './acquisition/funnel-steps';

const SESSION_KEY = 'modista_session_id';
const DEDUPE_KEY = 'modista_funnel_dedupe';

interface UTMData {
  source?: string;
  campaign?: string;
  fbc?: string;
  fbp?: string;
  medium?: string;
  content?: string;
  term?: string;
}

const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

type Step =
  | 'course_detail_view'
  | 'cta_click'
  | 'pricing_visible'
  | 'form_view'
  | 'form_start'
  | 'form_submit'
  | 'lead'
  | 'initiate_checkout'
  | 'scroll_50'
  | 'scroll_90'
  | 'redirect_to_payment'
  | 'purchase';

const inFlight = new Set<string>();

const hasFired = (key: string): boolean => {
  try {
    const dedupe = JSON.parse(sessionStorage.getItem(DEDUPE_KEY) || '{}');
    return Boolean(dedupe[key]);
  } catch { return false; }
};

const markFired = (key: string): void => {
  try {
    const dedupe = JSON.parse(sessionStorage.getItem(DEDUPE_KEY) || '{}');
    dedupe[key] = Date.now();
    sessionStorage.setItem(DEDUPE_KEY, JSON.stringify(dedupe));
  } catch { /* La telemetría no debe bloquear el funnel. */ }
};

export const trackFunnel = (step: Step, extra: { courseId?: string; courseTitle?: string; inscriptionId?: string; value?: number } = {}): void => {
  if (!hasMarketingConsent()) return;

  if (import.meta.env.DEV) {
    console.log(`[Funnel] ${step}`, extra);
    return;
  }
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return;
  const dedupeKey = `${step}_${extra.courseId || ''}_${extra.inscriptionId || ''}`;
  if (hasFired(dedupeKey) || inFlight.has(dedupeKey)) return;
  inFlight.add(dedupeKey);

  // The acquisition API keeps its own visit-based record; the legacy endpoint below stays during the transition.
  const mirrored = acquisitionEventFor(step, extra);
  if (mirrored) trackAcquisitionEvent(mirrored.name, mirrored.extra);

  const utm: UTMData = (getStoredUTMData() as UTMData) || {};
  const fbp = utm.fbp || getCookie('_fbp');
  const eventId = step === 'course_detail_view' && extra.courseId
    ? buildMetaEventId('view_content', extra.courseId, sessionId)
    : undefined;
  const payload = {
    sessionId,
    step,
    courseId: extra.courseId,
    courseTitle: extra.courseTitle,
    inscriptionId: extra.inscriptionId,
    value: extra.value,
    eventTime: Math.floor(Date.now() / 1000),
    eventId,
    eventSourceUrl: window.location.href,
    utmSource: utm.source,
    utmCampaign: utm.campaign,
    referrer: document.referrer || undefined,
    fbc: utm.fbc,
    fbp,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
  };

  window.dataLayer?.push({ event: `funnel_${step}`, ...payload });

  apiClient.post('/funnel/event', payload, { timeout: 5000 })
    .then(() => markFired(dedupeKey))
    .catch(() => {})
    .finally(() => inFlight.delete(dedupeKey));
};

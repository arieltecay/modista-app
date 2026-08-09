import { getStoredUTMData } from './utm-tracking';
import { apiClient } from '../services/config/apiClient';

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
  | 'scroll_50'
  | 'scroll_90'
  | 'redirect_to_payment';

const shouldFire = (key: string): boolean => {
  try {
    const dedupe = JSON.parse(sessionStorage.getItem(DEDUPE_KEY) || '{}');
    if (dedupe[key]) return false;
    dedupe[key] = Date.now();
    sessionStorage.setItem(DEDUPE_KEY, JSON.stringify(dedupe));
    return true;
  } catch { return true; }
};

export const trackFunnel = (step: Step, extra: { courseId?: string; courseTitle?: string; inscriptionId?: string; value?: number } = {}): void => {
  if (import.meta.env.DEV) {
    console.log(`[Funnel] ${step}`, extra);
    return;
  }
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return;
  const dedupeKey = `${step}_${extra.courseId || ''}_${extra.inscriptionId || ''}`;
  if (!shouldFire(dedupeKey)) return;

  const utm: UTMData = (getStoredUTMData() as UTMData) || {};
  const fbp = utm.fbp || getCookie('_fbp');
  const payload = {
    sessionId,
    step,
    courseId: extra.courseId,
    courseTitle: extra.courseTitle,
    inscriptionId: extra.inscriptionId,
    value: extra.value,
    eventTime: Math.floor(Date.now() / 1000),
    utmSource: utm.source,
    utmCampaign: utm.campaign,
    referrer: document.referrer || undefined,
    fbc: utm.fbc,
    fbp,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
  };

  window.dataLayer?.push({ event: `funnel_${step}`, ...payload });

  apiClient.post('/funnel/event', payload, { timeout: 5000 }).catch(() => {});
};

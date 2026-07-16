import { getStoredUTMData } from './utm-tracking';

const SESSION_KEY = 'modista_session_id';
const API_URL = import.meta.env.VITE_API_URL;
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

type Step = 'cta_click' | 'pricing_visible' | 'form_view' | 'scroll_50' | 'scroll_90' | 'redirect_to_payment';

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
  const payload = {
    sessionId,
    step,
    courseId: extra.courseId,
    courseTitle: extra.courseTitle,
    inscriptionId: extra.inscriptionId,
    value: extra.value,
    utmSource: utm.source,
    utmCampaign: utm.campaign,
    referrer: document.referrer || undefined,
    fbc: utm.fbc,
    fbp: utm.fbp,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
  };

  window.dataLayer?.push({ event: `funnel_${step}`, ...payload });

  fetch(`${API_URL}/api/funnel/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
};

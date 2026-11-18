import type { AxiosError } from 'axios';
import { apiClient } from '../../services/config/apiClient';
import { setPixelInvokedObserver } from '../../services/meta-pixel';
import { getCookieValue } from '../cookies';
import { META_MARKETING_CONSENT_EVENT, hasMarketingConsent } from '../privacy-consent';
import { getStoredUTMData } from '../utm-tracking';
import { createAcquisitionTracker } from './tracker';
import type { AcquisitionTracker, PostResult, PublicEventName, StorageLike, TrackEventExtra } from './types';

const SESSION_KEY = 'modista_session_id';
const REQUEST_TIMEOUT_MS = 5000;

/** Opt-in client flag: it is also the rollback switch, independent of the server flag. */
const isEnabled = (): boolean => import.meta.env.VITE_ACQUISITION_TRACKING_ENABLED === 'true';

/** sessionStorage is per tab, which is what makes two tabs two visits; it can also be blocked. */
const tabStorage: StorageLike = {
  getItem: (key) => {
    try { return sessionStorage.getItem(key); } catch { return null; }
  },
  setItem: (key, value) => {
    try { sessionStorage.setItem(key, value); } catch { /* blocked storage */ }
  },
  removeItem: (key) => {
    try { sessionStorage.removeItem(key); } catch { /* blocked storage */ }
  },
};

const statusOf = (error: unknown): number => {
  const direct = (error as { status?: unknown }).status;
  if (typeof direct === 'number') return direct;
  return (error as AxiosError).response?.status ?? 0;
};

const post = async (path: string, body: object): Promise<PostResult> => {
  try {
    await apiClient.post(path, body, { timeout: REQUEST_TIMEOUT_MS });
    return { status: 200 };
  } catch (error) {
    return { status: statusOf(error) };
  }
};

let tracker: AcquisitionTracker | undefined;

const getTracker = (): AcquisitionTracker => {
  tracker ??= createAcquisitionTracker({
    enabled: isEnabled(),
    storage: tabStorage,
    hasConsent: hasMarketingConsent,
    getVisitorId: () => {
      try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
    },
    now: () => new Date(),
    uuid: () => crypto.randomUUID(),
    page: () => ({
      pathname: window.location.pathname,
      search: window.location.search,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    }),
    hasFbc: () => Boolean(getStoredUTMData()?.fbc || getCookieValue('_fbc') || new URLSearchParams(window.location.search).get('fbclid')),
    hasFbp: () => Boolean(getCookieValue('_fbp')),
    post,
    wait: (ms) => new Promise((resolve) => { window.setTimeout(resolve, ms); }),
  });
  return tracker;
};

export const trackAcquisitionEvent = (name: PublicEventName, extra?: TrackEventExtra): void => {
  void getTracker().trackEvent(name, extra);
};

/**
 * Starts the acquisition tracking of this page: follows consent changes (a revocation forgets the
 * visit, a grant opens one) and reports each Pixel call. Returns the function that stops it.
 */
export const startAcquisitionTracking = (): (() => void) => {
  const onConsentChange = (event: Event) => {
    const marketing = (event as CustomEvent<{ marketing?: boolean }>).detail?.marketing;
    if (marketing) void getTracker().ensureVisit();
    else getTracker().reset();
  };
  window.addEventListener(META_MARKETING_CONSENT_EVENT, onConsentChange);
  setPixelInvokedObserver((eventId) => void getTracker().reportPixelInvoked(eventId));

  return () => {
    window.removeEventListener(META_MARKETING_CONSENT_EVENT, onConsentChange);
    setPixelInvokedObserver(undefined);
  };
};

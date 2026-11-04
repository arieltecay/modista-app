export const META_MARKETING_CONSENT_VERSION = 'privacy-2026-11';
export const META_MARKETING_CONSENT_EVENT = 'modista:privacy-consent-changed';

const CONSENT_KEY = 'modista_privacy_consent';
const SESSION_KEY = 'modista_session_id';
const UTM_KEY = 'modista_utm_data';
const PENDING_REVOCATION_KEY = 'modista_pending_consent_revocation';
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
const API_URL = import.meta.env.VITE_API_URL;

interface ConsentRecord {
  marketing: boolean;
  version: string;
  updatedAt: string;
}

const readConsentRecord = (): ConsentRecord | null => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    const updatedAt = Date.parse(parsed.updatedAt || '');
    if (
      parsed.version !== META_MARKETING_CONSENT_VERSION ||
      typeof parsed.marketing !== 'boolean' ||
      !Number.isFinite(updatedAt) ||
      updatedAt > Date.now() ||
      Date.now() - updatedAt > CONSENT_MAX_AGE_MS
    ) return null;
    return parsed as ConsentRecord;
  } catch {
    return null;
  }
};

export const hasMarketingConsent = (): boolean => readConsentRecord()?.marketing === true;

export const getMarketingConsentChoice = (): boolean | null => {
  const record = readConsentRecord();
  return record ? record.marketing : null;
};

const dispatchConsentChange = (marketing: boolean): void => {
  window.dispatchEvent(new CustomEvent(META_MARKETING_CONSENT_EVENT, { detail: { marketing } }));
};

const saveConsentRecord = (marketing: boolean, dispatch = true): void => {
  const record: ConsentRecord = {
    marketing,
    version: META_MARKETING_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  if (dispatch) dispatchConsentChange(marketing);
};

const expireCookie = (name: string): void => {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
  document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${window.location.hostname}; SameSite=Lax; Secure`;
};

export const clearMarketingIdentifiers = (keepSessionId = false): void => {
  if (!keepSessionId) localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(UTM_KEY);
  sessionStorage.removeItem('modista_session_tracked');
  sessionStorage.removeItem('modista_funnel_dedupe');
  expireCookie('_fbc');
  expireCookie('_fbp');
  expireCookie('_clck');
  expireCookie('_clsk');
  expireCookie('_ga');
  expireCookie('_gid');
  expireCookie('_gat');
  expireCookie('_gcl_au');
  document.cookie.split(';').forEach(cookie => {
    const name = cookie.trim().split('=')[0];
    if (name.startsWith('_ga_')) expireCookie(name);
  });
};

const getOrCreateSessionId = (): string => {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};

const sendConsentToApi = async (sessionId: string, marketingConsent: boolean): Promise<void> => {
  const baseUrl = API_URL?.replace(/\/+$/, '');
  if (!baseUrl) throw new Error('No se pudo guardar la preferencia de privacidad.');

  const response = await fetch(`${baseUrl}/api/privacy/marketing-consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      marketingConsent,
      policyVersion: META_MARKETING_CONSENT_VERSION,
    }),
    keepalive: !marketingConsent,
  });

  if (!response.ok) throw new Error('No se pudo guardar la preferencia de privacidad.');
};

export const saveMarketingConsent = async (marketingConsent: boolean): Promise<boolean> => {
  const previousChoice = getMarketingConsentChoice();
  const existingSessionId = localStorage.getItem(SESSION_KEY);

  if (marketingConsent) {
    const sessionId = getOrCreateSessionId();
    await sendConsentToApi(sessionId, true);
    localStorage.removeItem(PENDING_REVOCATION_KEY);
    saveConsentRecord(true);
    return false;
  }

  if (previousChoice === true && existingSessionId) {
    saveConsentRecord(false, false);
    if (window.fbq) window.fbq('consent', 'revoke');
    localStorage.setItem(PENDING_REVOCATION_KEY, existingSessionId);
    clearMarketingIdentifiers(true);
    dispatchConsentChange(false);
    await sendConsentToApi(existingSessionId, false);
    localStorage.removeItem(PENDING_REVOCATION_KEY);
    clearMarketingIdentifiers();
    return true;
  }

  saveConsentRecord(false, false);
  clearMarketingIdentifiers();
  dispatchConsentChange(false);
  return false;
};

export const initializePrivacyConsent = (): void => {
  if (!hasMarketingConsent()) clearMarketingIdentifiers(!!localStorage.getItem(PENDING_REVOCATION_KEY));

  const pendingSessionId = localStorage.getItem(PENDING_REVOCATION_KEY);
  if (!pendingSessionId) return;
  void sendConsentToApi(pendingSessionId, false).then(() => {
    localStorage.removeItem(PENDING_REVOCATION_KEY);
    clearMarketingIdentifiers();
  }).catch(() => {});
};

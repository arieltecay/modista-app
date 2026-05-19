/**
 * UTM Tracking Utility
 * Captures UTM parameters from URL and persists them in sessionStorage
 */

const UTM_KEY = 'modista_utm_data';

export interface UTMData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  full_utm?: string;
  timestamp: number;
}

export const captureUTMParameters = (): void => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source') || urlParams.get('utm'); // Soporta ?utm=instagram_paid

  if (utmSource) {
    const utmData: UTMData = {
      source: utmSource,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      term: urlParams.get('utm_term') || undefined,
      content: urlParams.get('utm_content') || undefined,
      full_utm: window.location.search,
      timestamp: Date.now()
    };

    sessionStorage.setItem(UTM_KEY, JSON.stringify(utmData));
    console.log('[UTM Tracker] Parámetros capturados:', utmData.source);
  }
};

export const getStoredUTMData = (): UTMData | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = sessionStorage.getItem(UTM_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UTMData;
  } catch (e) {
    return null;
  }
};

export const clearUTMData = (): void => {
  sessionStorage.removeItem(UTM_KEY);
};

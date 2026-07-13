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
  fbc?: string;
  fbp?: string;
  timestamp: number;
}

const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

export const captureUTMParameters = (): void => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source') || urlParams.get('utm'); 
  const fbclidFromUrl = urlParams.get('fbclid');
const fbcFromCookie = getCookie('_fbc');
const fbc = fbclidFromUrl
    ? `fb.1.${Date.now()}.${fbclidFromUrl}`
    : fbcFromCookie;
  const fbp = getCookie('_fbp');

  // Solo guardamos si hay algo nuevo que rastrear o si ya existe data previa para actualizar fbc/fbp
  if (utmSource || fbc || fbp) {
    const existingData = getStoredUTMData() || { timestamp: Date.now() };
    
    const utmData: UTMData = {
      ...existingData,
      source: utmSource || existingData.source,
      medium: urlParams.get('utm_medium') || existingData.medium,
      campaign: urlParams.get('utm_campaign') || existingData.campaign,
      term: urlParams.get('utm_term') || existingData.term,
      content: urlParams.get('utm_content') || existingData.content,
      full_utm: window.location.search || existingData.full_utm,
      fbc: fbc || existingData.fbc,
      fbp: fbp || existingData.fbp,
      timestamp: Date.now()
    };

    sessionStorage.setItem(UTM_KEY, JSON.stringify(utmData));
    console.log('[Marketing Tracker] Parámetros actualizados:', { source: utmData.source, hasMeta: !!(fbc || fbp) });
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

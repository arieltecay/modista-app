import { getStoredUTMData, getUTMPayload } from '../../utils/utm-tracking';
import { getCookieValue } from '../../utils/cookies';
import { hasMarketingConsent } from '../../utils/privacy-consent';

const optional = <T>(read: () => T, fallback: T): T => {
  try {
    return read();
  } catch {
    return fallback;
  }
};

/** Browser storage and marketing data must never prevent the enrollment POST. */
export const getEnrollmentAttribution = () => {
  const marketingConsent = optional(hasMarketingConsent, false);
  const utmData = optional(getStoredUTMData, null);
  return {
    marketingSource: utmData?.source || 'organic',
    utmParams: optional(getUTMPayload, {}),
    sessionId: marketingConsent ? optional(() => localStorage.getItem('modista_session_id'), null) || undefined : undefined,
    metaFbc: marketingConsent ? utmData?.fbc || optional(() => getCookieValue('_fbc'), undefined) : undefined,
    metaFbp: marketingConsent ? utmData?.fbp || optional(() => getCookieValue('_fbp'), undefined) : undefined,
  };
};

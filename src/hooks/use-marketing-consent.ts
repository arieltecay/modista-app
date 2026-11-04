import { useEffect, useState } from 'react';
import { hasMarketingConsent, META_MARKETING_CONSENT_EVENT } from '../utils/privacy-consent';

export const useMarketingConsent = (): boolean => {
  const [granted, setGranted] = useState(hasMarketingConsent);

  useEffect(() => {
    const sync = () => setGranted(hasMarketingConsent());
    window.addEventListener(META_MARKETING_CONSENT_EVENT, sync);
    return () => window.removeEventListener(META_MARKETING_CONSENT_EVENT, sync);
  }, []);

  return granted;
};

/* eslint-disable */
// @ts-nocheck
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateFbpFromCookie } from '../../utils/utm-tracking';
import { META_MARKETING_CONSENT_VERSION } from '../../utils/privacy-consent';
import { useMarketingConsent } from '../../hooks/use-marketing-consent';

const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-W5DMS7RV';
// Acepta ambos nombres de env (la de prod puede estar con cualquiera de las dos).
// Sin esto, Clarity NO se cargaba cuando la env se definió como VITE_CLARITY_PROJECT_ID.
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || import.meta.env.VITE_CLARITY_PROJECT_ID;
const FB_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
const API_URL = import.meta.env.VITE_API_URL;
const SESSION_KEY = 'modista_session_id';

const GoogleTagManager = () => {
  const location = useLocation();
  const marketingConsent = useMarketingConsent();

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      const choice = (event as CustomEvent<{ marketing: boolean }>).detail?.marketing;
      const optionalTrackerWasLoaded = Boolean(document.querySelector(
        'script[src*="googletagmanager.com/gtm.js"], script[src*="fbevents.js"], script[src*="clarity.ms/tag/"]',
      ));
      if (choice === false && optionalTrackerWasLoaded) setTimeout(() => window.location.reload(), 0);
    };
    const META_MARKETING_CONSENT_EVENT = 'modista:privacy-consent-changed';
    window.addEventListener(META_MARKETING_CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(META_MARKETING_CONSENT_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (!marketingConsent || import.meta.env.DEV) {
      if (window.fbq) window.fbq('consent', 'revoke');
      return;
    }

    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    // Cargar GTM solo después de la elección afirmativa; descarta eventos previos al consentimiento.
    window.dataLayer = [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(gtmScript);

    // 1. Microsoft Clarity
    if (CLARITY_ID && !window.clarity) {
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", CLARITY_ID);
    }

    // 3. Meta Pixel (Facebook Pixel)
    if (FB_PIXEL_ID && !window.fbq) {
      (function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js'));
      // Advanced Matching: external_id representa este navegador y se conserva
      // igual en Pixel y CAPI para los eventos de esta sesión persistente.
      fbq('init', FB_PIXEL_ID, { external_id: sessionId });
      fbq('consent', 'grant');
      // NOTA: no disparamos PageView acá. El useEffect de `location` (abajo)
      // ya emite PageView en el mount inicial y en cada cambio de ruta; hacerlo
      // en ambos lugares duplicaba el evento en cada carga de página.

      // Capturar fbp después de que el Pixel inicialice y setee el cookie _fbp
      setTimeout(() => {
        updateFbpFromCookie();
      }, 1000);
    } else if (FB_PIXEL_ID && window.fbq) {
      window.fbq('consent', 'grant');
      // Pixel ya estaba inicializado (navegación SPA), actualizar fbp de todas formas
      setTimeout(() => {
        updateFbpFromCookie();
      }, 500);
    }

    // 4. Session tracking solo con consentimiento vigente.
    const trackedSession = sessionStorage.getItem('modista_session_tracked');
    if (!trackedSession) {
      sessionStorage.setItem('modista_session_tracked', 'true');


      const params = new URLSearchParams(window.location.search);
      fetch(`${API_URL}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Meta-Consent': 'granted',
          'X-Meta-Consent-Version': META_MARKETING_CONSENT_VERSION,
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify({
          sessionId,
          utmSource: params.get('utm_source') || undefined,
          utmMedium: params.get('utm_medium') || undefined,
          utmCampaign: params.get('utm_campaign') || undefined,
          utmTerm: params.get('utm_term') || undefined,
          utmContent: params.get('utm_content') || undefined,
          referrer: document.referrer || undefined,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          landingPage: window.location.pathname,
        }),
      }).catch(() => {});
    }
  }, [marketingConsent]);

  // Efecto para enviar un evento a dataLayer y Meta cada vez que la URL cambia.
  useEffect(() => {
    // SILENT MODE: No enviar métricas si estamos en el panel de administración
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    if (marketingConsent && window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: {
            path: location.pathname + location.search,
            title: document.title
        }
      });
    }

    if (marketingConsent && window.fbq) {
      const sessionId = localStorage.getItem(SESSION_KEY);
      window.fbq('track', 'PageView', {}, { eventID: `pageview_${sessionId}_${Date.now()}` });
    }
  }, [location, marketingConsent]);

  return null; // No renderiza nada visible
};

export default GoogleTagManager;

/* eslint-disable */
// @ts-nocheck
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GTM_ID = import.meta.env.VITE_GTM_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;
const FB_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;

const GoogleTagManager = () => {
  const location = useLocation();

  // SILENT MODE: No inicializar ni enviar métricas si estamos en desarrollo
  if (import.meta.env.DEV) {
    return null;
  }

  // Efecto para inicializar los scripts de GTM, Clarity y Meta Pixel.
  // Se ejecuta solo una vez.
  useEffect(() => {
    // 1. Google Tag Manager
    if (GTM_ID && !document.querySelector(`script[src*="${GTM_ID}"]`)) {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});let f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',GTM_ID);
    }

    // 2. Microsoft Clarity
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
      fbq('init', FB_PIXEL_ID);
      fbq('track', 'PageView');
    }
  }, []);

  // Efecto para enviar un evento a dataLayer y Meta cada vez que la URL cambia.
  useEffect(() => {
    // SILENT MODE: No enviar métricas si estamos en el panel de administración
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: {
            path: location.pathname + location.search,
            title: document.title
        }
      });
    }

    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null; // No renderiza nada visible
};

export default GoogleTagManager;

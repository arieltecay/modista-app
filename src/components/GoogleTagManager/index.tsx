/* eslint-disable */
// @ts-nocheck
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GTM_ID = import.meta.env.VITE_GTM_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;

const GoogleTagManager = () => {
  const location = useLocation();

  // SILENT MODE: No inicializar ni enviar métricas si estamos en desarrollo
  if (import.meta.env.DEV) {
    return null;
  }

  // Efecto para inicializar los scripts de GTM y Clarity.
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
  }, []);

  // Efecto para enviar un evento a dataLayer cada vez que la URL cambia.
  // GTM usará este evento para registrar una "pageview".
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
  }, [location]);

  return null; // No renderiza nada visible
};

export default GoogleTagManager;

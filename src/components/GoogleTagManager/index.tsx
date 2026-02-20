/* eslint-disable */
// @ts-nocheck
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GTM_ID = import.meta.env.VITE_GTM_ID;

const GoogleTagManager = () => {
  const location = useLocation();

  // Efecto para inicializar el script de GTM.
  // Se ejecuta solo una vez.
  useEffect(() => {
    if (!GTM_ID) {
      console.warn("Google Tag Manager ID no está configurado.");
      return;
    }

    // Evitar duplicar el script
    if (document.querySelector(`script[src*="${GTM_ID}"]`)) {
        return;
    }

    // Inyecta el script principal de GTM en el <head>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});let f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',GTM_ID);

  }, []);

  // Efecto para enviar un evento a dataLayer cada vez que la URL cambia.
  // GTM usará este evento para registrar una "pageview".
  useEffect(() => {
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

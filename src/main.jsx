import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

// Registro de Service Worker para PWA
registerSW({ immediate: true });

// --- SEGURO DE VIDA (Auto-Reload en caso de desactualización) ---
/**
 * Detecta si la aplicación falla al cargar un fragmento de código (chunk).
 * Esto suele ocurrir cuando el usuario tiene una versión cacheada antigua 
 * que intenta pedir archivos que ya no existen en el servidor tras un deploy.
 */
window.addEventListener('error', (e) => {
  const isChunkError = /Loading chunk [^ ]+ failed/.test(e.message) || 
                       /Loading CSS chunk [^ ]+ failed/.test(e.message);
  
  if (isChunkError) {
    console.warn('⚠️ Detectada versión desactualizada. Forzando recarga...');
    // Evitamos bucles infinitos guardando el timestamp del último refresco
    const lastReload = sessionStorage.getItem('last-reload');
    const now = Date.now();
    
    if (!lastReload || now - parseInt(lastReload) > 10000) {
      sessionStorage.setItem('last-reload', now.toString());
      window.location.reload();
    }
  }
}, true);

// Función para reportar métricas de rendimiento a GA4
function reportWebVitals(metric) {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'web_vitals',
      event_category: 'Web Vitals',
      event_action: metric.name,
      event_value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
      event_label: metric.id,
      non_interaction: true,
    });
  }
  
  if (import.meta.env.DEV) {
    console.log(`📊 Web Vital [${metric.name}]:`, metric.value);
  }
}

// Iniciar monitoreo de métricas de usuario reales (Modern Web Vitals)
onCLS(reportWebVitals);
onINP(reportWebVitals); // Reemplaza a FID en v4+
onLCP(reportWebVitals);
onFCP(reportWebVitals);
onTTFB(reportWebVitals);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

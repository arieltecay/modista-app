import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

// Registro de Service Worker para PWA con lógica de auto-update mejorada
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('✨ Nueva versión disponible. Recargando...');
    updateSW(true); // Fuerza la actualización y recarga
  },
  onOfflineReady() {
    console.log('📱 App lista para trabajar offline');
  },
});

/**
 * Verificación periódica de actualizaciones del Service Worker.
 * Útil para usuarios que dejan la pestaña abierta por mucho tiempo.
 */
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hora
setInterval(() => {
  console.log('🔍 Buscando actualizaciones del sistema...');
  updateSW(true);
}, CHECK_INTERVAL);

// --- SEGURO DE VIDA (Auto-Reload en caso de desactualización) ---
/**
 * Detecta si la aplicación falla al cargar un fragmento de código (chunk).
 * Esto suele ocurrir cuando el usuario tiene una versión cacheada antigua 
 * que intenta pedir archivos que ya no existen en el servidor tras un deploy.
 */
window.addEventListener('error', (e) => {
  const isChunkError = /Loading chunk [^ ]+ failed/.test(e.message) || 
                       /Loading CSS chunk [^ ]+ failed/.test(e.message) ||
                       e.message?.includes('Importing a module script failed');

  if (isChunkError) {
    console.warn('⚠️ Detectada versión desactualizada por error de carga. Forzando recarga limpia...');
    // Evitamos bucles infinitos guardando el timestamp del último refresco
    const lastReload = sessionStorage.getItem('last-reload');
    const now = Date.now();

    if (!lastReload || now - parseInt(lastReload) > 10000) {
      sessionStorage.setItem('last-reload', now.toString());
      // Forzamos recarga desde el servidor ignorando cache local
      window.location.reload();
    }
  }
}, true);

// Función para reportar métricas de rendimiento a GA4
function reportWebVitals(metric) {
  // Solo enviar a GTM en producción
  if (import.meta.env.PROD && window.dataLayer) {
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
    console.log(`📊 [DEV] Web Vital [${metric.name}]:`, metric.value);
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

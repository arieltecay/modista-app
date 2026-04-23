import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

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

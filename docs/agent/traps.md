# Traps

- En landings pagas, mantener la validación telefónica estricta como import diferido al enviar; cargar `libphonenumber-js` al inicio compite con el render crítico (`src/utils/validators.ts`).
- Cloudflare Pages ya cachea assets con hash; no agregar reglas amplias para HTML, `sw.js` o rutas SPA (`public/_headers`).
- El código de la aplicación es el propietario de los eventos de Meta; GTM no debe duplicarlos.
- `ViewContent` se intenta al obtener consentimiento y nuevamente cuando el Pixel anuncia que está listo; los IDs y el almacenamiento de sesión evitan duplicados.
- Nunca agregar email, teléfono, `fbc` o `fbp` a `custom_data` del Pixel. Las coincidencias avanzadas pertenecen a la inicialización y CAPI.
- La atribución de una visita sale solo de la URL actual: las UTM guardadas de páginas previas no rotan la visita ni se envían. De la URL viajan únicamente `utm_*` acotadas; nunca `fbclid`, query ni el referrer completo (solo su origen). Evidencia: `src/utils/acquisition/visit-context.ts`.
- Un evento se marca como hecho solo después de que el servidor lo acepta (2xx); 4xx no se reintenta y 0/429/5xx se reintentan 2 veces. La telemetría nunca lanza ni bloquea CTA, formulario o pago. Evidencia: `src/utils/acquisition/tracker.ts`.
- El estado de adquisición se limpia al revocar el consentimiento (`clearMarketingIdentifiers` y el evento de consentimiento); las claves están duplicadas a propósito para evitar un ciclo de imports.
- `apiClient` conserva `status` en los errores con mensaje para distinguir fallos reintentables. Evidencia: `src/services/config/apiClient.ts`.

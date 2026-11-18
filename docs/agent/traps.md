# Traps

- En landings pagas, mantener la validación telefónica estricta como import diferido al enviar; cargar `libphonenumber-js` al inicio compite con el render crítico (`src/utils/validators.ts`).
- Cloudflare Pages ya cachea assets con hash; no agregar reglas amplias para HTML, `sw.js` o rutas SPA (`public/_headers`).
- El código de la aplicación es el propietario de los eventos de Meta; GTM no debe duplicarlos.
- `ViewContent` se intenta al obtener consentimiento y nuevamente cuando el Pixel anuncia que está listo; los IDs y el almacenamiento de sesión evitan duplicados.
- Nunca agregar email, teléfono, `fbc` o `fbp` a `custom_data` del Pixel. Las coincidencias avanzadas pertenecen a la inicialización y CAPI.
- El preload crítico de Camisas replica el asset configurado en el CMS; actualizar `index.html` si cambia la imagen del hero.
- Web Analytics se inyecta desde Cloudflare, no desde el repo. No activar a la vez Pages Analytics y la inyección automática de la zona: duplican `beacon.min.js`.

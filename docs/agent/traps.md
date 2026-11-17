# Traps

- En landings pagas, mantener la validación telefónica estricta como import diferido al enviar; cargar `libphonenumber-js` al inicio compite con el render crítico (`src/utils/validators.ts`).
- Cloudflare Pages ya cachea assets con hash; no agregar reglas amplias para HTML, `sw.js` o rutas SPA (`public/_headers`).

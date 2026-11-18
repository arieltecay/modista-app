# Changelog

## [Unreleased]
- Registra visitas, eventos de comportamiento y llamadas al Pixel en la API de adquisición (con consentimiento y detrás de `VITE_ACQUISITION_TRACKING_ENABLED`).
- Reduce el peso de imágenes y validaciones del checkout, y estabiliza superficies señaladas por Web Analytics.
- Registra `ViewContent`, `InitiateCheckout`, `Lead` y `Purchase` con IDs deterministas y sin PII en los datos personalizados del Pixel.
- Deduplica vistas de la landing, espera consentimiento/Pixel disponible y envía las etapas internas del embudo al backend.
- Aclara la preventa del curso de camisas, el acceso desde el 23/11 y mejora el contraste móvil de la landing.
- Corrige el reporte de Web Vitals al importar la validación de consentimiento de marketing.
- Fija el color de negritas y cursivas del contenido enriquecido para mantener contraste en el detalle del curso.
- Eleva las preferencias de privacidad sobre el CTA fijo de inscripción en pantallas móviles.
- Solicita consentimiento antes de cargar herramientas opcionales y permite revocarlo desde el sitio.
- Excluye email y teléfono del dataLayer de Google Tag Manager.
- Alinea el identificador de usuario del Pixel y CAPI con el UUID persistente del navegador.
- Explica el uso de Pixel/CAPI, los datos compartidos con Meta y cómo contactarnos por derechos sobre datos.

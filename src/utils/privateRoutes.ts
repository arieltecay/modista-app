/**
 * Rutas cuya URL contiene un token secreto (hoy, la factura: `/factura/<token>`).
 * No deben cargar ni notificar a GTM, Pixel, Clarity ni al registro de visitas: ese token es la llave de acceso.
 * Evidencia del riesgo: `acquisition/tracker.ts` envía `pathname` y `reportWebVitals` lo manda al dataLayer.
 */
const PRIVATE_DOCUMENT_PREFIX = /^\/factura\/[^/]+\/?$/;

export const isPrivateDocumentPath = (pathname: string): boolean => PRIVATE_DOCUMENT_PREFIX.test(pathname);

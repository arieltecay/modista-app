import type { PublicInvoice } from './types';

const PUBLIC_TOKEN = /^[a-f0-9]{64}$/;

/**
 * GET /api/invoices/public/:token
 *
 * Usa `fetch` y no `apiClient` a propósito: este pedido no debe llevar sesión, cookies de Meta ni cabeceras de
 * seguimiento, y el token de la URL no debe viajar en el `Referer`.
 * Devuelve null si la factura no existe (o todavía no fue autorizada) y lanza ante cualquier otra falla.
 */
export const getPublicInvoice = async (token: string): Promise<PublicInvoice | null> => {
  if (!PUBLIC_TOKEN.test(token)) return null;

  const response = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/invoices/public/${token}`, {
    credentials: 'omit',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`No se pudo cargar la factura (HTTP ${response.status})`);
  return response.json();
};

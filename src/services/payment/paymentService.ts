import { apiClient } from '../config/apiClient';
import type {
  PaymentStatusResponse,
  CreatePreferenceResponse,
} from './types';

/**
 * GET /api/payment/status/:inscriptionId
 *
 * Consulta el estado actual del pago de una inscripción.
 * Usado por las páginas de retorno (/payment/success|failure|pending)
 * para hacer polling y mostrar feedback inmediato al usuario.
 */
export const getPaymentStatus = (inscriptionId: string): Promise<PaymentStatusResponse> =>
  apiClient.get(`/payment/status/${inscriptionId}`);

/**
 * POST /api/payment/create-preference
 *
 * Genera (o regenera) una preference de MercadoPago para una inscripción existente.
 * Útil para reintentos desde la página de failure.
 */
export const createPreferenceForInscription = (inscriptionId: string): Promise<CreatePreferenceResponse> =>
  apiClient.post('/payment/create-preference', { inscriptionId });

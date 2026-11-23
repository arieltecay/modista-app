const GENERIC_MESSAGE = 'No se pudo generar el link de pago. Contactanos por WhatsApp.';
const COUPON_UNAVAILABLE_MESSAGE = 'El cupón ya no está disponible. Contactanos por WhatsApp y te ayudamos a completar tu inscripción.';

const TOO_MANY_ATTEMPTS_MESSAGE = 'Hiciste demasiados intentos. Esperá unos minutos y volvé a probar, o contactanos por WhatsApp.';

/** What to tell the person when a new payment link cannot be generated (409 = the coupon of the inscription ended, 429 = too many attempts). */
export const paymentRetryMessage = (error: unknown): string => {
  const status = (error as { status?: number } | null | undefined)?.status;
  if (status === 409) return COUPON_UNAVAILABLE_MESSAGE;
  return status === 429 ? TOO_MANY_ATTEMPTS_MESSAGE : GENERIC_MESSAGE;
};

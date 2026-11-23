import { describe, expect, it } from 'vitest';
import { paymentRetryMessage } from './paymentRetryMessage';

describe('paymentRetryMessage', () => {
  it('explains that the coupon is no longer available when the server answers 409', () => {
    const conflict = Object.assign(new Error('El cupón ya no está disponible'), { status: 409 });

    expect(paymentRetryMessage(conflict)).toMatch(/cupón ya no está disponible/i);
    expect(paymentRetryMessage(conflict)).toMatch(/WhatsApp/);
  });

  it('asks to wait when the server says there were too many attempts (429)', () => {
    const tooMany = Object.assign(new Error('Demasiados intentos, esperá unos minutos'), { status: 429 });

    expect(paymentRetryMessage(tooMany)).toMatch(/demasiados intentos/i);
    expect(paymentRetryMessage(tooMany)).toMatch(/minutos/);
  });

  it('keeps the generic message for any other failure', () => {
    expect(paymentRetryMessage(Object.assign(new Error('boom'), { status: 500 }))).toBe('No se pudo generar el link de pago. Contactanos por WhatsApp.');
    expect(paymentRetryMessage(new Error('Network Error'))).toBe('No se pudo generar el link de pago. Contactanos por WhatsApp.');
    expect(paymentRetryMessage(undefined)).toBe('No se pudo generar el link de pago. Contactanos por WhatsApp.');
  });
});

import { describe, expect, it } from 'vitest';
import { resolveCheckoutDestination } from './checkoutDestination';

describe('resolveCheckoutDestination', () => {
  const paid = { coursePrice: 20900, inscriptionId: 'inscription-123', isDevelopment: false };

  it('opens the Mercado Pago preference when it exists', () => {
    expect(resolveCheckoutDestination({ ...paid, mpInitPoint: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1' }))
      .toEqual({ kind: 'payment', url: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1' });
  });

  it('keeps a paid inscription recoverable when the payment link is missing', () => {
    expect(resolveCheckoutDestination(paid))
      .toEqual({ kind: 'recovery', url: '/payment/failure?inscription_id=inscription-123&reason=checkout_unavailable' });
  });

  it('never invents a recovery URL without an inscription id', () => {
    expect(resolveCheckoutDestination({ ...paid, inscriptionId: undefined })).toBeNull();
  });
});

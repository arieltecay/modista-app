import { describe, expect, it, vi } from 'vitest';
import { checkCoupon, payableAmount } from './couponCheck';

const VALID = { valid: true as const, code: 'MODISTA20', listPrice: 20900, discountAmount: 4180, finalPrice: 16720 };

describe('checkCoupon', () => {
  it('does not call the API for an empty code', async () => {
    const validate = vi.fn();

    for (const code of ['', '   ']) {
      expect(await checkCoupon(code, 'c1', validate)).toEqual({ kind: 'rejected', message: 'Ingresá un código de cupón' });
    }
    expect(validate).not.toHaveBeenCalled();
  });

  it('applies a valid coupon with the prices the server computed', async () => {
    const validate = vi.fn().mockResolvedValue(VALID);

    const outcome = await checkCoupon(' modista20 ', 'c1', validate);

    expect(validate).toHaveBeenCalledWith('modista20', 'c1');
    expect(outcome).toEqual({
      kind: 'applied',
      coupon: { code: 'MODISTA20', listPrice: 20900, discountAmount: 4180, finalPrice: 16720 },
    });
  });

  it('shows the message of a rejected coupon', async () => {
    const validate = vi.fn().mockResolvedValue({ valid: false, message: 'El cupón no es válido para este curso' });

    expect(await checkCoupon('NOPE', 'c1', validate)).toEqual({ kind: 'rejected', message: 'El cupón no es válido para este curso' });
  });

  it('turns any failure of the request into a friendly message, never a technical one', async () => {
    const validate = vi.fn().mockRejectedValue(new Error('Request failed with status code 500'));

    const outcome = await checkCoupon('MODISTA20', 'c1', validate);

    expect(outcome.kind).toBe('rejected');
    expect(JSON.stringify(outcome)).not.toMatch(/500|Request failed/);
  });
});

describe('checkCoupon when the server asks to slow down', () => {
  it('tells the person to wait and that the purchase can go on without a coupon', async () => {
    const tooMany = Object.assign(new Error('Demasiados intentos, esperá unos minutos'), { status: 429 });
    const validate = vi.fn().mockRejectedValue(tooMany);

    const outcome = await checkCoupon('MODISTA20', 'c1', validate);

    expect(outcome).toEqual({
      kind: 'rejected',
      message: 'Hiciste demasiados intentos. Esperá unos minutos para probar otro cupón; mientras tanto podés inscribirte sin cupón.',
    });
  });

  it('keeps the generic message for other failures, even with a status', async () => {
    const serverError = Object.assign(new Error('boom'), { status: 500 });
    const validate = vi.fn().mockRejectedValue(serverError);

    const outcome = await checkCoupon('MODISTA20', 'c1', validate);

    expect(outcome).toEqual({ kind: 'rejected', message: 'No pudimos verificar el cupón. Probá de nuevo en unos minutos.' });
  });
});

describe('payableAmount', () => {
  it('is the course price without coupon and the final price with one', () => {
    expect(payableAmount(20900, null)).toBe(20900);
    expect(payableAmount(20900, { finalPrice: 16720 })).toBe(16720);
  });

  it('is zero when the course has no price yet', () => {
    expect(payableAmount(undefined, null)).toBe(0);
  });
});

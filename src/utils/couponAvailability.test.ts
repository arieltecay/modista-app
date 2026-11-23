import { describe, expect, it, vi } from 'vitest';
import { isCouponFieldAvailable } from './couponAvailability';

describe('isCouponFieldAvailable', () => {
  it('is true only when the server says a coupon can be used on the course', async () => {
    expect(await isCouponFieldAvailable('c1', vi.fn().mockResolvedValue({ available: true }))).toBe(true);
    expect(await isCouponFieldAvailable('c1', vi.fn().mockResolvedValue({ available: false }))).toBe(false);
  });

  it('asks about the course it was given', async () => {
    const ask = vi.fn().mockResolvedValue({ available: true });

    await isCouponFieldAvailable('course-uuid', ask);

    expect(ask).toHaveBeenCalledWith('course-uuid');
  });

  it('hides the field when the question fails, so the purchase never depends on the coupon', async () => {
    expect(await isCouponFieldAvailable('c1', vi.fn().mockRejectedValue(new Error('Network Error')))).toBe(false);
    expect(await isCouponFieldAvailable('c1', vi.fn().mockRejectedValue(Object.assign(new Error('x'), { status: 429 })))).toBe(false);
  });

  it('hides the field for any answer that is not a clear yes', async () => {
    for (const answer of [undefined, null, {}, { available: 'true' }, { available: 1 }, 'yes']) {
      expect(await isCouponFieldAvailable('c1', vi.fn().mockResolvedValue(answer))).toBe(false);
    }
  });
});

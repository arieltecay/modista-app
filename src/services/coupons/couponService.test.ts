import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock('../config/apiClient', () => ({ apiClient: api }));

import { validateCoupon } from './couponService';

describe('validateCoupon', () => {
  beforeEach(() => api.post.mockReset());

  it('asks the API for the price of a code on a course, with the code trimmed', async () => {
    api.post.mockResolvedValue({ valid: true, code: 'MODISTA20', listPrice: 20900, discountAmount: 4180, finalPrice: 16720 });

    const result = await validateCoupon('  modista20 ', 'course-uuid');

    expect(api.post).toHaveBeenCalledWith('/coupons/validate', { code: 'modista20', courseId: 'course-uuid' });
    expect(result).toEqual({ valid: true, code: 'MODISTA20', listPrice: 20900, discountAmount: 4180, finalPrice: 16720 });
  });

  it('returns the rejection as the API sent it', async () => {
    api.post.mockResolvedValue({ valid: false, message: 'El cupón no es válido para este curso' });

    expect(await validateCoupon('NOPE', 'course-uuid')).toEqual({ valid: false, message: 'El cupón no es válido para este curso' });
  });
});

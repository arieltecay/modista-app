import { describe, expect, it } from 'vitest';
import { acquisitionEventFor } from './funnel-steps';

describe('funnel step mirroring', () => {
  it('mirrors the behavioural steps the API accepts', () => {
    for (const step of ['course_detail_view', 'cta_click', 'pricing_visible', 'form_view', 'form_start', 'form_submit', 'scroll_50', 'scroll_90', 'redirect_to_payment']) {
      expect(acquisitionEventFor(step, { courseId: 'c1' })?.name, step).toBe(step);
    }
  });

  it('never mirrors the commercial facts, which only the server may create', () => {
    for (const step of ['lead', 'initiate_checkout', 'purchase', 'unknown_step']) {
      expect(acquisitionEventFor(step, { courseId: 'c1', inscriptionId: 'i1' }), step).toBeUndefined();
    }
  });

  it('keys the occurrence like the funnel dedupe does and forwards only the course', () => {
    const mirrored = acquisitionEventFor('redirect_to_payment', { courseId: 'c1', inscriptionId: 'insc-1', courseTitle: 'x', value: 5 });
    expect(mirrored).toEqual({ name: 'redirect_to_payment', extra: { courseId: 'c1', key: 'redirect_to_payment_c1_insc-1' } });
  });
});

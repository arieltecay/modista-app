import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildMetaEventId,
  setPixelInvokedObserver,
  trackMetaInitiateCheckout,
  trackMetaLead,
  trackMetaPurchase,
  trackMetaViewContent,
} from './meta-pixel';

describe('Meta Pixel tracking', () => {
  const fbq = vi.fn();

  beforeEach(() => {
    fbq.mockReset();
  });

  it('builds the same deterministic IDs used by CAPI', () => {
    expect(buildMetaEventId('lead', 'inscription-1')).toBe('lead_inscription-1');
    expect(buildMetaEventId('checkout', 'inscription-1')).toBe('checkout_inscription-1');
    expect(buildMetaEventId('purchase', 'inscription-1')).toBe('purchase_inscription-1');
    expect(buildMetaEventId('view_content', 'course-1', '12345678-session')).toBe(
      'view_content_course-1_12345678',
    );
  });

  it('does not send ViewContent without consent', () => {
    const sent = trackMetaViewContent({
      consentGranted: false,
      fbq,
      courseId: 'course-1',
      courseTitle: 'Camisas',
      sessionId: '12345678-session',
      value: 100,
    });

    expect(sent).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
  });

  it('sends ViewContent with a deterministic eventID', () => {
    const values = new Map<string, string>();
    const dedupeStore = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    const sent = trackMetaViewContent({
      consentGranted: true,
      fbq,
      courseId: 'course-1',
      courseTitle: 'Camisas',
      sessionId: '12345678-session',
      value: 100,
      dedupeStore,
    });

    expect(sent).toBe(true);
    expect(fbq).toHaveBeenCalledWith(
      'track',
      'ViewContent',
      expect.objectContaining({ content_ids: ['course-1'], currency: 'ARS', value: 100 }),
      { eventID: 'view_content_course-1_12345678' },
    );

    expect(trackMetaViewContent({
      consentGranted: true,
      fbq,
      courseId: 'course-1',
      courseTitle: 'Camisas',
      sessionId: '12345678-session',
      value: 100,
      dedupeStore,
    })).toBe(false);
    expect(fbq).toHaveBeenCalledTimes(1);
  });

  it('does not put customer identifiers into Lead custom data', () => {
    trackMetaLead({
      consentGranted: true,
      fbq,
      inscriptionId: 'inscription-1',
      courseTitle: 'Camisas',
      value: 100,
    });

    const customData = fbq.mock.calls[0]?.[2] as Record<string, unknown>;
    expect(customData).not.toHaveProperty('em');
    expect(customData).not.toHaveProperty('ph');
    expect(customData).not.toHaveProperty('fbc');
    expect(customData).not.toHaveProperty('fbp');
    expect(fbq.mock.calls[0]?.[3]).toEqual({ eventID: 'lead_inscription-1' });
  });

  describe('pixel invocation observer', () => {
    const inscriptionEvent = { consentGranted: true, courseTitle: 'Camisas', value: 100, inscriptionId: 'insc-1' };

    it('reports the event id of every pixel call that was actually made', () => {
      const observer = vi.fn();
      setPixelInvokedObserver(observer);
      trackMetaLead({ ...inscriptionEvent, fbq });
      trackMetaInitiateCheckout({ ...inscriptionEvent, fbq });
      trackMetaPurchase({ ...inscriptionEvent, fbq });
      trackMetaViewContent({ consentGranted: true, fbq, courseId: 'course-1', courseTitle: 'Camisas', sessionId: '12345678-session', value: 100 });
      expect(observer.mock.calls.map(([eventId]) => eventId)).toEqual([
        'lead_insc-1', 'checkout_insc-1', 'purchase_insc-1', 'view_content_course-1_12345678',
      ]);
      setPixelInvokedObserver(undefined);
    });

    it('stays silent when the pixel was not called (no consent, no fbq, deduplicated)', () => {
      const observer = vi.fn();
      setPixelInvokedObserver(observer);
      trackMetaLead({ ...inscriptionEvent, consentGranted: false, fbq });
      trackMetaLead({ ...inscriptionEvent, fbq: undefined });
      const dedupeStore = { getItem: () => '1', setItem: vi.fn() };
      trackMetaViewContent({ consentGranted: true, fbq, courseId: 'c', courseTitle: 't', sessionId: '12345678-session', value: 1, dedupeStore });
      expect(observer).not.toHaveBeenCalled();
      setPixelInvokedObserver(undefined);
    });

    it('never lets a failing observer break the pixel call', () => {
      setPixelInvokedObserver(() => { throw new Error('observer down'); });
      expect(trackMetaLead({ ...inscriptionEvent, fbq })).toBe(true);
      expect(fbq).toHaveBeenCalledTimes(1);
      setPixelInvokedObserver(undefined);
    });
  });
});

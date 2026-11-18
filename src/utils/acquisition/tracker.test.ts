import { describe, expect, it } from 'vitest';
import { createAcquisitionTracker } from './tracker';
import type { PostResult, StorageLike, TrackerDeps } from './types';
import { VISIT_CONTEXT_KEY, VISIT_IDLE_MS } from './visit-context';

const VISITOR = '11111111-1111-4111-8111-111111111111';

const memoryStorage = (): StorageLike => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: (key) => void values.delete(key),
  };
};

interface Call { path: string; body: Record<string, unknown> }

const setup = (overrides: Partial<TrackerDeps> = {}, responses: PostResult[] = []) => {
  let currentPage = { pathname: '/lp/curso', search: '?utm_source=instagram', referrer: '', userAgent: 'Mozilla/5.0 (iPhone)' };
  const calls: Call[] = [];
  const waits: number[] = [];
  let clock = new Date('2026-11-18T12:00:00.000Z').getTime();
  let n = 0;
  const queue = [...responses];
  const deps: TrackerDeps = {
    enabled: true,
    hasConsent: () => true,
    getVisitorId: () => VISITOR,
    storage: memoryStorage(),
    now: () => new Date(clock),
    uuid: () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`,
    page: () => currentPage,
    hasFbc: () => false,
    hasFbp: () => true,
    post: async (path, body) => {
      calls.push({ path, body: body as Record<string, unknown> });
      return queue.shift() ?? { status: 200 };
    },
    wait: async (ms) => void waits.push(ms),
    ...overrides,
  };
  const tracker = createAcquisitionTracker(deps);
  return { tracker, deps, calls, waits, advance: (ms: number) => { clock += ms; }, setPage: (next: Partial<typeof currentPage>) => { currentPage = { ...currentPage, ...next }; } };
};

describe('acquisition tracker gating', () => {
  it('does nothing when the flag is off, consent is missing or there is no visitor', async () => {
    for (const overrides of [{ enabled: false }, { hasConsent: () => false }, { getVisitorId: () => null }]) {
      const { tracker, calls } = setup(overrides);
      await tracker.trackEvent('cta_click');
      await tracker.reportPixelInvoked('lead_abc12345');
      await tracker.ensureVisit();
      expect(calls).toEqual([]);
    }
  });

  it('ignores event names the server owns (lead, checkout, purchase) and unknown ones', async () => {
    const { tracker, calls } = setup();
    for (const name of ['lead', 'initiate_checkout', 'purchase', 'whatever']) await tracker.trackEvent(name as never);
    expect(calls).toEqual([]);
  });
});

describe('acquisition tracker posting', () => {
  it('registers the visit first and then the event, with the documented bodies', async () => {
    const { tracker, calls } = setup();
    await tracker.trackEvent('cta_click', { courseId: 'course-1' });

    expect(calls.map((call) => call.path)).toEqual(['/acquisition/visits', '/acquisition/events']);
    const [visit, event] = calls.map((call) => call.body);
    expect(visit).toMatchObject({ visitorId: VISITOR, entryPath: '/lp/curso', landingSlug: 'curso', utm: { source: 'instagram' }, device: 'mobile', hasFbp: true, hasFbc: false });
    expect(event).toMatchObject({ visitId: visit.visitId, visitorId: VISITOR, name: 'cta_click', path: '/lp/curso', courseId: 'course-1', landingSlug: 'curso' });
    expect(typeof event.eventId).toBe('string');
    expect(typeof event.occurredAt).toBe('string');
  });

  it('keeps events behind a slow visit request so the visit exists first', async () => {
    const order: string[] = [];
    let releaseVisit: () => void = () => {};
    const { tracker } = setup({
      post: (path) => {
        order.push(`start ${path}`);
        if (path === '/acquisition/visits') return new Promise((resolve) => { releaseVisit = () => { order.push('visit done'); resolve({ status: 201 }); }; });
        return Promise.resolve({ status: 201 });
      },
    });
    const pending = tracker.trackEvent('page_view');
    await Promise.resolve();
    await Promise.resolve();
    releaseVisit();
    await pending;
    expect(order).toEqual(['start /acquisition/visits', 'visit done', 'start /acquisition/events']);
  });

  it('sends the visit once and reuses it for later events', async () => {
    const { tracker, calls } = setup();
    await tracker.trackEvent('page_view');
    await tracker.trackEvent('cta_click');
    await tracker.trackEvent('form_view');
    expect(calls.filter((call) => call.path === '/acquisition/visits')).toHaveLength(1);
    expect(new Set(calls.filter((call) => call.path === '/acquisition/events').map((call) => call.body.visitId)).size).toBe(1);
  });

  it('starts a new visit after the idle window', async () => {
    const { tracker, calls, advance } = setup();
    await tracker.trackEvent('page_view');
    advance(VISIT_IDLE_MS + 1);
    await tracker.trackEvent('page_view');
    expect(calls.filter((call) => call.path === '/acquisition/visits')).toHaveLength(2);
  });

  it('uses the stable event id it is given and generates one otherwise', async () => {
    const { tracker, calls } = setup();
    await tracker.trackEvent('form_start', { eventId: 'form_start_stable_id' });
    await tracker.trackEvent('page_view');
    const ids = calls.filter((call) => call.path === '/acquisition/events').map((call) => call.body.eventId);
    expect(ids[0]).toBe('form_start_stable_id');
    expect(ids[1]).not.toBe(ids[0]);
  });

  it('derives a stable event id from the visit and a caller key, so a repeated occurrence is sent once', async () => {
    const { tracker, calls } = setup();
    await tracker.trackEvent('form_start', { key: 'form_start_course-1_' });
    await tracker.trackEvent('form_start', { key: 'form_start_course-1_' });
    const events = calls.filter((call) => call.path === '/acquisition/events');
    const visitId = calls.find((call) => call.path === '/acquisition/visits')?.body.visitId;
    expect(events).toHaveLength(1);
    expect(events[0].body.eventId).toBe(`form_start_${visitId}_form_start_course-1_`);
    expect(String(events[0].body.eventId)).toMatch(/^[A-Za-z0-9_.:-]{8,128}$/);
  });

  it('never sends personal or commercial fields', async () => {
    const { tracker, calls } = setup();
    await tracker.trackEvent('form_submit', { courseId: 'course-1', inscriptionId: 'x', value: 99, email: 'a@b.com' } as never);
    const serialized = JSON.stringify(calls);
    for (const leak of ['"value"', 'inscriptionId', 'a@b.com', 'email']) expect(serialized).not.toContain(leak);
  });
});

describe('acquisition tracker reliability', () => {
  it('retries transient failures a bounded number of times, then gives up silently', async () => {
    const { tracker, calls, waits } = setup({}, [{ status: 201 }, { status: 0 }, { status: 503 }, { status: 429 }]);
    await expect(tracker.trackEvent('cta_click')).resolves.toBeUndefined();
    expect(calls.filter((call) => call.path === '/acquisition/events')).toHaveLength(3);
    expect(waits).toEqual([500, 1500]);
  });

  it('recovers when a retry succeeds', async () => {
    const { tracker, calls } = setup({}, [{ status: 201 }, { status: 503 }, { status: 201 }]);
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_retry_ok' });
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_retry_ok' });
    expect(calls.filter((call) => call.path === '/acquisition/events')).toHaveLength(2); // second call is deduped after success
  });

  it('does not retry client errors or consent no-ops', async () => {
    for (const status of [400, 409, 204]) {
      const { tracker, calls } = setup({}, [{ status: 201 }, { status }]);
      await tracker.trackEvent('cta_click');
      expect(calls.filter((call) => call.path === '/acquisition/events'), String(status)).toHaveLength(1);
    }
  });

  it('never throws, even when the transport rejects', async () => {
    const { tracker } = setup({ post: () => Promise.reject(new Error('boom')) });
    await expect(tracker.trackEvent('page_view')).resolves.toBeUndefined();
    await expect(tracker.reportPixelInvoked('lead_abc12345')).resolves.toBeUndefined();
  });

  it('marks an event as done only after the server accepted it', async () => {
    const { tracker, calls } = setup({}, [{ status: 201 }, { status: 400 }, { status: 201 }]);
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_dedupe_1' }); // rejected (400): not marked
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_dedupe_1' }); // retried by the caller: goes out again
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_dedupe_1' }); // accepted before: skipped
    expect(calls.filter((call) => call.path === '/acquisition/events')).toHaveLength(2);
  });

  it('does not send the same event twice while the first is still in flight', async () => {
    const { tracker, calls } = setup();
    await Promise.all([
      tracker.trackEvent('cta_click', { eventId: 'cta_click_inflight' }),
      tracker.trackEvent('cta_click', { eventId: 'cta_click_inflight' }),
    ]);
    expect(calls.filter((call) => call.path === '/acquisition/events')).toHaveLength(1);
  });
});

describe('acquisition tracker pixel signals', () => {
  it('reports that the browser invoked the pixel, once per event id', async () => {
    const { tracker, calls } = setup();
    await tracker.reportPixelInvoked('lead_abc12345');
    await tracker.reportPixelInvoked('lead_abc12345');
    const signals = calls.filter((call) => call.path === '/acquisition/signals/browser');
    expect(signals).toHaveLength(1);
    expect(signals[0].body).toMatchObject({ eventId: 'lead_abc12345', visitorId: VISITOR, channel: 'browser_pixel', status: 'invoked' });
    expect(signals[0].body.visitId).toBe(calls.find((call) => call.path === '/acquisition/visits')?.body.visitId);
  });
});

describe('acquisition tracker reset (consent revoked)', () => {
  it('forgets the visit and the dedupe so a later grant starts clean', async () => {
    const storage = memoryStorage();
    const { tracker, calls, deps } = setup({ storage });
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_reset_1' });
    tracker.reset();
    expect(storage.getItem(VISIT_CONTEXT_KEY)).toBeNull();
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_reset_1' });
    expect(calls.filter((call) => call.path === '/acquisition/visits')).toHaveLength(2);
    expect(calls.filter((call) => call.path === '/acquisition/events')).toHaveLength(2);
    expect(deps.enabled).toBe(true);
  });
});

describe('acquisition tracker review fixes', () => {
  it('stops retrying and writes nothing once consent is revoked mid-flight', async () => {
    const storage = memoryStorage();
    let revoke: () => void = () => {};
    const { tracker, calls } = setup(
      { storage, wait: async () => revoke() },
      [{ status: 201 }, { status: 0 }, { status: 0 }, { status: 0 }],
    );
    revoke = () => tracker.reset();
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_revoked_1' });
    expect(calls.filter((call) => call.path === '/acquisition/events')).toHaveLength(1);
    expect(storage.getItem(VISIT_CONTEXT_KEY)).toBeNull();
    expect(storage.getItem('modista_acquisition_dedupe')).toBeNull();
  });

  it('does not send anything when consent disappears while waiting for the visit', async () => {
    let consent = true;
    let releaseVisit: () => void = () => {};
    const { tracker, calls } = setup({
      hasConsent: () => consent,
      post: (path, body) => {
        calls_.push({ path, body: body as Record<string, unknown> });
        return path === '/acquisition/visits' ? new Promise((resolve) => { releaseVisit = () => resolve({ status: 201 }); }) : Promise.resolve({ status: 201 });
      },
    });
    const calls_: Call[] = calls;
    const pending = tracker.trackEvent('cta_click');
    await Promise.resolve();
    consent = false;
    tracker.reset();
    releaseVisit();
    await pending;
    expect(calls.filter((call) => call.path === '/acquisition/events')).toHaveLength(0);
  });

  it('re-sends a visit that failed with the data of its entry, not of the current page', async () => {
    const { tracker, calls, setPage } = setup({}, [{ status: 400 }, { status: 201 }, { status: 201 }]);
    await tracker.trackEvent('page_view', { eventId: 'page_view_first_try' });
    setPage({ pathname: '/otra', search: '', referrer: 'https://elsewhere.example/' });
    await tracker.trackEvent('cta_click', { eventId: 'cta_click_second_try' });
    const visits = calls.filter((call) => call.path === '/acquisition/visits');
    expect(visits).toHaveLength(2);
    expect(visits[1].body).toMatchObject({ entryPath: '/lp/curso', utm: { source: 'instagram' } });
    expect(visits[1].body.referrer).toBeUndefined();
  });

  it('uses the document referrer only for the visit born with the document, not for later ones', async () => {
    const { tracker, calls, advance, setPage } = setup();
    setPage({ referrer: 'https://l.facebook.com/l.php?u=secret' });
    await tracker.trackEvent('page_view');
    advance(VISIT_IDLE_MS + 1);
    setPage({ search: '' });
    await tracker.trackEvent('page_view');
    const visits = calls.filter((call) => call.path === '/acquisition/visits');
    expect(visits[0].body.referrer).toBe('https://l.facebook.com');
    expect(visits[1].body.referrer).toBeUndefined();
  });

  it('keeps a single visit when storage is blocked', async () => {
    const blocked = { getItem: () => null, setItem: () => { throw new Error('blocked'); }, removeItem: () => {} };
    const { tracker, calls } = setup({ storage: blocked });
    await tracker.trackEvent('page_view');
    await tracker.trackEvent('cta_click');
    expect(calls.filter((call) => call.path === '/acquisition/visits')).toHaveLength(1);
  });

  it('omits a course id the server would reject instead of losing the event', async () => {
    const { tracker, calls } = setup();
    await tracker.trackEvent('cta_click', { courseId: 'not valid <id>' });
    await tracker.trackEvent('form_view', { courseId: 'curso_1' });
    const events = calls.filter((call) => call.path === '/acquisition/events');
    expect(events[0].body.courseId).toBeUndefined();
    expect(events[1].body.courseId).toBe('curso_1');
  });

  it('never rejects when the id generator itself fails', async () => {
    const { tracker } = setup({ uuid: () => { throw new Error('no crypto'); } });
    await expect(tracker.trackEvent('page_view')).resolves.toBeUndefined();
    await expect(tracker.reportPixelInvoked('lead_abc12345')).resolves.toBeUndefined();
  });
});

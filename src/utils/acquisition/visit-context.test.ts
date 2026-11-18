import { describe, expect, it } from 'vitest';
import {
  VISIT_CONTEXT_KEY,
  VISIT_IDLE_MS,
  VISIT_MAX_AGE_MS,
  buildVisitBody,
  deviceOf,
  entryFromPage,
  landingSlugOf,
  readTouchParams,
  resolveVisit,
  touchKeyOf,
} from './visit-context';
import type { StorageLike } from './types';

const memoryStorage = (): StorageLike & { dump: () => Map<string, string> } => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: (key) => void values.delete(key),
    dump: () => values,
  };
};

const VISITOR = '11111111-1111-4111-8111-111111111111';
const T0 = new Date('2026-11-18T12:00:00.000Z');
const later = (ms: number) => new Date(T0.getTime() + ms);
const later_ = later;

let counter = 0;
const uuid = () => `00000000-0000-4000-8000-${String(++counter).padStart(12, '0')}`;
const page = (overrides = {}) => ({ pathname: '/lp/curso', search: '', referrer: '', userAgent: 'Mozilla/5.0 (iPhone)', ...overrides });
const flags = { hasFbc: false, hasFbp: false };
const resolve = (storage: StorageLike, now: Date, search = '', visitorId = VISITOR, pageOverrides = {}) =>
  resolveVisit({ storage, now, uuid, visitorId, page: page({ search, ...pageOverrides }), flags });

describe('readTouchParams', () => {
  it('reads the current URL campaign parameters, trimmed and bounded', () => {
    const touch = readTouchParams('?utm_source= Instagram &utm_medium=paid_social&utm_campaign=black&utm_term=t&utm_content=c&fbclid=abc123');
    expect(touch).toEqual({ source: 'Instagram', medium: 'paid_social', campaign: 'black', term: 't', content: 'c', clickId: 'abc123' });
    expect(readTouchParams(`?utm_source=${'x'.repeat(500)}`).source).toHaveLength(120);
  });

  it('accepts the short utm alias used by the site and ignores empty or unrelated parameters', () => {
    expect(readTouchParams('?utm=ig').source).toBe('ig');
    expect(readTouchParams('?utm_source=&foo=bar&email=a@b.com')).toEqual({});
    expect(readTouchParams('')).toEqual({});
  });
});

describe('touchKeyOf', () => {
  it('is empty without an explicit campaign touch and ignores case and spacing', () => {
    expect(touchKeyOf({})).toBe('');
    expect(touchKeyOf(readTouchParams('?utm_source=Instagram'))).toBe(touchKeyOf(readTouchParams('?utm_source=instagram')));
    expect(touchKeyOf(readTouchParams('?utm_source=instagram'))).not.toBe(touchKeyOf(readTouchParams('?utm_source=facebook')));
  });

  it('never keeps the click id (or any campaign text) readable in the key', () => {
    const key = touchKeyOf(readTouchParams('?utm_source=instagram&fbclid=secretclickid123'));
    expect(key).not.toContain('secretclickid123');
    expect(key).not.toContain('instagram');
  });

  it('treats a new ad click (different fbclid) as a different touch', () => {
    expect(touchKeyOf(readTouchParams('?fbclid=aaa'))).not.toBe(touchKeyOf(readTouchParams('?fbclid=bbb')));
  });
});

describe('resolveVisit', () => {
  it('creates and persists a visit when there is none', () => {
    const storage = memoryStorage();
    const { context, isNew } = resolve(storage, T0, '?utm_source=instagram');
    expect(isNew).toBe(true);
    expect(context).toMatchObject({ visitorId: VISITOR, startedAt: T0.toISOString(), lastActivityAt: T0.toISOString() });
    expect(storage.dump().has(VISIT_CONTEXT_KEY)).toBe(true);
  });

  it('reuses the visit inside the idle window and moves lastActivityAt forward', () => {
    const storage = memoryStorage();
    const first = resolve(storage, T0);
    const second = resolve(storage, later(VISIT_IDLE_MS));
    expect(second.isNew).toBe(false);
    expect(second.context.visitId).toBe(first.context.visitId);
    expect(second.context.startedAt).toBe(T0.toISOString());
    expect(second.context.lastActivityAt).toBe(later(VISIT_IDLE_MS).toISOString());
  });

  it('rotates after more than 30 minutes without activity', () => {
    const storage = memoryStorage();
    const first = resolve(storage, T0);
    const second = resolve(storage, later(VISIT_IDLE_MS + 1));
    expect(second.isNew).toBe(true);
    expect(second.context.visitId).not.toBe(first.context.visitId);
  });

  it('keeps the visit while activity keeps it alive, until it exceeds the maximum age', () => {
    const storage = memoryStorage();
    const first = resolve(storage, T0);
    for (let ms = VISIT_IDLE_MS; ms < VISIT_MAX_AGE_MS; ms += VISIT_IDLE_MS) resolve(storage, later(ms));
    expect(resolve(storage, later(VISIT_MAX_AGE_MS - 1)).context.visitId).toBe(first.context.visitId);
    expect(resolve(storage, later(VISIT_MAX_AGE_MS + 1)).isNew).toBe(true);
  });

  it('rotates on a new explicit campaign touch but not on a reload of the same URL', () => {
    const storage = memoryStorage();
    const first = resolve(storage, T0, '?utm_source=instagram&utm_medium=paid_social');
    expect(resolve(storage, later(1000), '?utm_source=instagram&utm_medium=paid_social').isNew).toBe(false);
    const other = resolve(storage, later(2000), '?utm_source=facebook&utm_medium=paid_social');
    expect(other.isNew).toBe(true);
    expect(other.context.visitId).not.toBe(first.context.visitId);
  });

  it('does not rotate when later pages carry no parameters, even if the visit started with a campaign', () => {
    const storage = memoryStorage();
    const first = resolve(storage, T0, '?utm_source=instagram');
    expect(resolve(storage, later(5000), '').context.visitId).toBe(first.context.visitId);
  });

  it('rotates when a campaign link arrives in a visit that started direct', () => {
    const storage = memoryStorage();
    resolve(storage, T0, '');
    expect(resolve(storage, later(5000), '?utm_source=instagram').isNew).toBe(true);
  });

  it('starts a new visit when the visitor changed (e.g. after revoking and granting consent again)', () => {
    const storage = memoryStorage();
    const first = resolve(storage, T0);
    const second = resolve(storage, later(1000), '', '22222222-2222-4222-8222-222222222222');
    expect(second.isNew).toBe(true);
    expect(second.context.visitId).not.toBe(first.context.visitId);
  });

  it('discards a corrupt, incomplete or impossible stored context', () => {
    const invalid = [
      'not json',
      '{}',
      JSON.stringify({ visitId: 1 }),
      JSON.stringify({ visitId: 'v', visitorId: VISITOR, startedAt: 'x', lastActivityAt: 'y', touchKey: '' }),
      JSON.stringify({ visitId: 'v', visitorId: VISITOR, startedAt: later(60_000).toISOString(), lastActivityAt: later(60_000).toISOString(), touchKey: '', entry: { entryPath: '/' } }),
      JSON.stringify({ visitId: 'v', visitorId: VISITOR, startedAt: T0.toISOString(), lastActivityAt: T0.toISOString(), touchKey: '' }),
    ];
    for (const raw of invalid) {
      const storage = memoryStorage();
      storage.setItem(VISIT_CONTEXT_KEY, raw);
      expect(resolve(storage, T0).isNew, raw).toBe(true);
    }
  });

  it('keeps the entry snapshot of the visit, so it survives reloads and later pages', () => {
    const storage = memoryStorage();
    const first = resolve(storage, T0, '?utm_source=instagram', VISITOR, { pathname: '/lp/curso', referrer: 'https://l.instagram.com/x' });
    const later = resolve(storage, later_(1000), '', VISITOR, { pathname: '/otra', referrer: '' });
    expect(later.context.entry).toEqual(first.context.entry);
    expect(first.context.entry).toMatchObject({ entryPath: '/lp/curso', referrer: 'https://l.instagram.com', utm: { source: 'instagram' } });
    expect(storage.dump().get(VISIT_CONTEXT_KEY)).not.toContain('fbclid');
  });

  it('keeps tabs independent: separate storages give separate visits for the same visitor', () => {
    const [tabA, tabB] = [memoryStorage(), memoryStorage()];
    expect(resolve(tabA, T0).context.visitId).not.toBe(resolve(tabB, T0).context.visitId);
  });

  it('still works when storage throws', () => {
    const broken: StorageLike = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    expect(resolve(broken, T0).isNew).toBe(true);
  });
});

describe('page helpers', () => {
  it('derives the landing slug only from /lp/<slug>', () => {
    expect(landingSlugOf('/lp/curso-camisas')).toBe('curso-camisas');
    expect(landingSlugOf('/lp/curso/otra')).toBe('curso');
    for (const path of ['/', '/cursos/abc', '/lp', '/lp/']) expect(landingSlugOf(path)).toBeUndefined();
  });

  it('classifies the device from the user agent', () => {
    expect(deviceOf('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)')).toBe('mobile');
    expect(deviceOf('Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile')).toBe('mobile');
    expect(deviceOf('Mozilla/5.0 (iPad; CPU OS 17_0)')).toBe('tablet');
    expect(deviceOf('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)')).toBe('desktop');
    expect(deviceOf('')).toBe('unknown');
  });
});

describe('buildVisitBody', () => {
  const contextFor = (pageOverrides = {}) => {
    const search = '?utm_source=instagram&utm_medium=paid_social&utm_campaign=black&fbclid=abc&email=a@b.com';
    const entry = entryFromPage(page({ search, referrer: 'https://l.instagram.com/?u=secret-token#frag', ...pageOverrides }), { hasFbc: true, hasFbp: false });
    return { visitId: 'v-1', visitorId: VISITOR, startedAt: T0.toISOString(), lastActivityAt: T0.toISOString(), touchKey: 'k', entry };
  };

  it('sends the entry campaign data, the landing and a referrer reduced to its origin', () => {
    expect(buildVisitBody(contextFor())).toEqual({
      visitId: 'v-1', visitorId: VISITOR, startedAt: T0.toISOString(), lastActivityAt: T0.toISOString(),
      entryPath: '/lp/curso', landingSlug: 'curso', referrer: 'https://l.instagram.com',
      utm: { source: 'instagram', medium: 'paid_social', campaign: 'black' }, device: 'mobile', hasFbc: true, hasFbp: false,
    });
  });

  it('never leaks the query string, click ids, tokens or unrelated parameters', () => {
    const serialized = JSON.stringify(buildVisitBody(contextFor()));
    for (const leak of ['fbclid', 'abc', 'a@b.com', 'secret-token', 'frag', 'email=']) expect(serialized).not.toContain(leak);
  });

  it('omits what does not exist instead of sending empty values', () => {
    const body = buildVisitBody(contextFor({ search: '', referrer: '', pathname: '/' }));
    expect(body.utm).toBeUndefined();
    expect(body.referrer).toBeUndefined();
    expect(body.landingSlug).toBeUndefined();
  });

  it('ignores a malformed referrer', () => {
    expect(buildVisitBody(contextFor({ referrer: 'not a url' })).referrer).toBeUndefined();
  });
});

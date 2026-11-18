import type { Device, PageSnapshot, StorageLike, TouchParams, VisitBody, VisitContext, VisitEntry } from './types';

export const VISIT_CONTEXT_KEY = 'modista_visit_context';
/** A visit ends after this long without activity. */
export const VISIT_IDLE_MS = 30 * 60 * 1000;
export const VISIT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const MAX_PARAM_LENGTH = 120;
const LANDING_SLUG = /^[a-z0-9][a-z0-9_-]{0,99}$/i;

const compact = <T extends object>(values: T): Partial<T> =>
  Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)) as Partial<T>;

export const readTouchParams = (search: string): TouchParams => {
  const params = new URLSearchParams(search);
  const read = (...names: string[]): string | undefined => {
    for (const name of names) {
      const value = params.get(name)?.trim();
      if (value) return value.slice(0, MAX_PARAM_LENGTH);
    }
    return undefined;
  };
  return compact({
    source: read('utm_source', 'utm'),
    medium: read('utm_medium'),
    campaign: read('utm_campaign'),
    term: read('utm_term'),
    content: read('utm_content'),
    clickId: read('fbclid'),
  });
};

/** FNV-1a: enough to tell two touches apart without keeping the click id or campaign text readable. */
const fingerprint = (text: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
};

/** Same key = same explicit touch (a reload); '' means the URL carries no campaign data. */
export const touchKeyOf = (touch: TouchParams): string => {
  const parts = [touch.source, touch.medium, touch.campaign, touch.term, touch.content, touch.clickId].map((part) => (part ?? '').trim().toLowerCase());
  return parts.every((part) => part === '') ? '' : fingerprint(parts.join('|'));
};

export const landingSlugOf = (pathname: string): string | undefined => {
  const slug = /^\/lp\/([^/]+)/.exec(pathname)?.[1];
  return slug && LANDING_SLUG.test(slug) ? slug : undefined;
};

export const deviceOf = (userAgent: string): Device => {
  if (!userAgent) return 'unknown';
  if (/iPad|Tablet/i.test(userAgent) || (/Android/i.test(userAgent) && !/Mobi/i.test(userAgent))) return 'tablet';
  return /Mobi|iPhone|Android/i.test(userAgent) ? 'mobile' : 'desktop';
};

/** Only the origin of the referrer leaves the browser: paths and query strings can carry tokens. */
const originOf = (referrer: string): string | undefined => {
  try {
    const url = new URL(referrer);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : undefined;
  } catch {
    return undefined;
  }
};

export const entryFromPage = (page: PageSnapshot, flags: { hasFbc: boolean; hasFbp: boolean }): VisitEntry => {
  const { clickId: _clickId, ...campaign } = readTouchParams(page.search);
  return {
    entryPath: page.pathname,
    device: deviceOf(page.userAgent),
    hasFbc: flags.hasFbc,
    hasFbp: flags.hasFbp,
    ...compact({
      landingSlug: landingSlugOf(page.pathname),
      referrer: originOf(page.referrer),
      utm: Object.keys(campaign).length === 0 ? undefined : campaign,
    }),
  };
};

const isDate = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));

const isEntry = (value: unknown): value is VisitEntry => {
  const entry = value as Partial<VisitEntry> | null;
  return typeof entry === 'object' && entry !== null && typeof entry.entryPath === 'string' &&
    typeof entry.device === 'string' && typeof entry.hasFbc === 'boolean' && typeof entry.hasFbp === 'boolean';
};

const readContext = (storage: StorageLike): VisitContext | null => {
  try {
    const raw = storage.getItem(VISIT_CONTEXT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VisitContext>;
    const valid =
      typeof parsed.visitId === 'string' && parsed.visitId !== '' &&
      typeof parsed.visitorId === 'string' &&
      typeof parsed.touchKey === 'string' &&
      isDate(parsed.startedAt) && isDate(parsed.lastActivityAt) && isEntry(parsed.entry);
    return valid ? (parsed as VisitContext) : null;
  } catch {
    return null;
  }
};

const writeContext = (storage: StorageLike, context: VisitContext): void => {
  try {
    storage.setItem(VISIT_CONTEXT_KEY, JSON.stringify(context));
  } catch { /* A blocked storage only means the caller keeps the context in memory; tracking must not break the page. */ }
};

const isUsable = (context: VisitContext, visitorId: string, now: Date): boolean => {
  const idle = now.getTime() - Date.parse(context.lastActivityAt);
  const age = now.getTime() - Date.parse(context.startedAt);
  return context.visitorId === visitorId && idle >= 0 && idle <= VISIT_IDLE_MS && age >= 0 && age <= VISIT_MAX_AGE_MS;
};

/**
 * Returns the visit this page belongs to. A new one starts when there is none, it went idle, it is
 * too old, the visitor changed, or the URL brings a different explicit campaign touch. Parameters
 * remembered from earlier pages never rotate a visit.
 */
export const resolveVisit = (input: {
  storage: StorageLike;
  now: Date;
  uuid: () => string;
  visitorId: string;
  page: PageSnapshot;
  flags: { hasFbc: boolean; hasFbp: boolean };
}): { context: VisitContext; isNew: boolean } => {
  const touchKey = touchKeyOf(readTouchParams(input.page.search));
  const stored = readContext(input.storage);
  const sameTouch = touchKey === '' || touchKey === stored?.touchKey;

  if (stored && isUsable(stored, input.visitorId, input.now) && sameTouch) {
    const context = { ...stored, lastActivityAt: input.now.toISOString() };
    writeContext(input.storage, context);
    return { context, isNew: false };
  }

  const startedAt = input.now.toISOString();
  const context: VisitContext = {
    visitId: input.uuid(),
    visitorId: input.visitorId,
    startedAt,
    lastActivityAt: startedAt,
    touchKey,
    entry: entryFromPage(input.page, input.flags),
  };
  writeContext(input.storage, context);
  return { context, isNew: true };
};

export const buildVisitBody = (context: VisitContext): VisitBody => ({
  visitId: context.visitId,
  visitorId: context.visitorId,
  startedAt: context.startedAt,
  lastActivityAt: context.lastActivityAt,
  ...context.entry,
});

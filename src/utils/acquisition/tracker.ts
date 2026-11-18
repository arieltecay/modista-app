import type { AcquisitionTracker, PublicEventName, TrackerDeps, TrackEventExtra, VisitContext } from './types';
import { VISIT_CONTEXT_KEY, buildVisitBody, landingSlugOf, resolveVisit } from './visit-context';

const DEDUPE_KEY = 'modista_acquisition_dedupe';
const DEDUPE_LIMIT = 200;
const RETRY_DELAYS_MS = [500, 1500];
const MAX_EVENT_ID_LENGTH = 128;

const PUBLIC_EVENTS: ReadonlySet<string> = new Set<PublicEventName>([
  'page_view', 'course_detail_view', 'pricing_visible', 'cta_click', 'form_view',
  'form_start', 'form_submit', 'scroll_50', 'scroll_90', 'redirect_to_payment',
]);

const stableEventId = (name: string, visitId: string, key: string): string =>
  `${name}_${visitId}_${key}`.replace(/[^A-Za-z0-9_.:-]/g, '_').slice(0, MAX_EVENT_ID_LENGTH);

const compact = <T extends object>(values: T): Partial<T> =>
  Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)) as Partial<T>;

/**
 * Sends visits, events and Pixel-invocation notices to the acquisition API. Everything is best
 * effort: consent and the client flag gate it, transient failures are retried a few times, an
 * occurrence is marked done only after the server accepted it, and nothing here ever throws.
 */
export const createAcquisitionTracker = (deps: TrackerDeps): AcquisitionTracker => {
  const inFlight = new Set<string>();
  let visitState: { visitId: string; ready: Promise<boolean> } | undefined;

  const isActive = (): boolean => deps.enabled && deps.hasConsent() && deps.getVisitorId() !== null;

  const readDone = (): string[] => {
    try {
      const parsed: unknown = JSON.parse(deps.storage.getItem(DEDUPE_KEY) ?? '[]');
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  };
  const isDone = (id: string): boolean => readDone().includes(id);
  const markDone = (id: string): void => {
    try {
      deps.storage.setItem(DEDUPE_KEY, JSON.stringify([...readDone(), id].slice(-DEDUPE_LIMIT)));
    } catch { /* Without storage the dedupe is per page load, which the server tolerates. */ }
  };

  /** True once the server accepted the request (any 2xx, including the 204 consent no-op). */
  const send = async (path: string, body: object): Promise<boolean> => {
    for (let attempt = 0; ; attempt += 1) {
      let status = 0;
      try {
        status = (await deps.post(path, body)).status;
      } catch {
        status = 0;
      }
      if (status >= 200 && status < 300) return true;
      const transient = status === 0 || status === 429 || status >= 500;
      if (!transient || attempt >= RETRY_DELAYS_MS.length) return false;
      await deps.wait(RETRY_DELAYS_MS[attempt]);
    }
  };

  /** Resolves the current visit and makes sure its registration is under way (once per visit and page load). */
  const currentVisit = (): VisitContext | null => {
    const visitorId = deps.getVisitorId();
    if (!visitorId) return null;
    const page = deps.page();
    const { context } = resolveVisit({ storage: deps.storage, now: deps.now(), uuid: deps.uuid, visitorId, search: page.search });

    if (visitState?.visitId !== context.visitId) {
      const body = buildVisitBody(context, page, { hasFbc: deps.hasFbc(), hasFbp: deps.hasFbp() });
      const ready = send('/acquisition/visits', body);
      const state = { visitId: context.visitId, ready };
      visitState = state;
      // A visit that never got through is sent again with the next event.
      void ready.then((accepted) => { if (!accepted && visitState === state) visitState = undefined; });
    }
    return context;
  };

  /** `idFor` names the occurrence from the resolved visit; it is sent only if the server has not accepted it yet. */
  const sendOnce = async (
    idFor: (context: VisitContext) => string,
    path: string,
    buildBody: (context: VisitContext, id: string) => object,
  ): Promise<void> => {
    if (!isActive()) return;
    try {
      const context = currentVisit();
      if (!context) return;
      const id = idFor(context);
      if (isDone(id) || inFlight.has(id)) return;
      inFlight.add(id);
      try {
        await visitState?.ready;
        if (await send(path, buildBody(context, id))) markDone(id);
      } finally {
        inFlight.delete(id);
      }
    } catch { /* Telemetry must never break the page. */ }
  };

  return {
    ensureVisit: async () => {
      if (!isActive()) return;
      try {
        currentVisit();
        await visitState?.ready;
      } catch { /* see sendOnce */ }
    },

    trackEvent: async (name, extra: TrackEventExtra = {}) => {
      if (!PUBLIC_EVENTS.has(name)) return;
      const fallbackId = deps.uuid();
      await sendOnce(
        (context) => extra.eventId ?? (extra.key ? stableEventId(name, context.visitId, extra.key) : fallbackId),
        '/acquisition/events',
        (visit, eventId) => {
          const page = deps.page();
          return compact({
            eventId,
            visitId: visit.visitId,
            visitorId: visit.visitorId,
            name,
            occurredAt: deps.now().toISOString(),
            path: page.pathname,
            landingSlug: landingSlugOf(page.pathname),
            courseId: extra.courseId,
          });
        },
      );
    },

    reportPixelInvoked: (eventId) =>
      sendOnce(
        () => `pixel:${eventId}`,
        '/acquisition/signals/browser',
        (visit) => ({
          eventId,
          visitId: visit.visitId,
          visitorId: visit.visitorId,
          channel: 'browser_pixel',
          status: 'invoked',
          occurredAt: deps.now().toISOString(),
        }),
      ),

    reset: () => {
      try {
        deps.storage.removeItem(VISIT_CONTEXT_KEY);
        deps.storage.removeItem(DEDUPE_KEY);
      } catch { /* nothing left to clear */ }
      visitState = undefined;
      inFlight.clear();
    },
  };
};

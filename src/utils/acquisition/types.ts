export type PublicEventName =
  | 'page_view'
  | 'course_detail_view'
  | 'pricing_visible'
  | 'cta_click'
  | 'form_view'
  | 'form_start'
  | 'form_submit'
  | 'scroll_50'
  | 'scroll_90'
  | 'redirect_to_payment';

export type Device = 'mobile' | 'desktop' | 'tablet' | 'unknown';

export interface StorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export interface VisitContext {
  visitId: string;
  visitorId: string;
  startedAt: string;
  lastActivityAt: string;
  /** Signature of the explicit campaign touch that opened the visit; '' for a direct visit. */
  touchKey: string;
}

/** Campaign parameters of the CURRENT URL only; stored attribution is never reused. */
export interface TouchParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  clickId?: string;
}

export interface PageSnapshot {
  pathname: string;
  search: string;
  referrer: string;
  userAgent: string;
}

export interface VisitBody {
  visitId: string;
  visitorId: string;
  startedAt: string;
  lastActivityAt: string;
  entryPath: string;
  device: Device;
  hasFbc: boolean;
  hasFbp: boolean;
  landingSlug?: string;
  referrer?: string;
  utm?: Omit<TouchParams, 'clickId'>;
}

/** `status` is the HTTP status, or 0 when the request never got an answer. */
export interface PostResult {
  status: number;
}

export interface TrackEventExtra {
  courseId?: string;
  /** Use when the caller already owns a stable id for this occurrence. */
  eventId?: string;
  /** Deterministic occurrence key; the tracker combines it with the visit to build a stable event id. */
  key?: string;
}

export interface TrackerDeps {
  enabled: boolean;
  storage: StorageLike;
  hasConsent: () => boolean;
  getVisitorId: () => string | null;
  now: () => Date;
  uuid: () => string;
  page: () => PageSnapshot;
  hasFbc: () => boolean;
  hasFbp: () => boolean;
  post: (path: string, body: object) => Promise<PostResult>;
  wait: (ms: number) => Promise<void>;
}

export interface AcquisitionTracker {
  trackEvent: (name: PublicEventName, extra?: TrackEventExtra) => Promise<void>;
  reportPixelInvoked: (eventId: string) => Promise<void>;
  ensureVisit: () => Promise<void>;
  reset: () => void;
}

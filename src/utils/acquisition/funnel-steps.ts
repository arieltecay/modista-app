import type { PublicEventName, TrackEventExtra } from './types';

/** Steps of the legacy funnel the acquisition API accepts; lead, checkout and purchase are created by the server. */
const MIRRORED_STEPS: ReadonlySet<string> = new Set<PublicEventName>([
  'course_detail_view', 'cta_click', 'pricing_visible', 'form_view', 'form_start',
  'form_submit', 'scroll_50', 'scroll_90', 'redirect_to_payment',
]);

/**
 * Maps a legacy funnel step to its acquisition event. The key repeats the funnel's own dedupe key,
 * so one occurrence is one event, and only the course travels along (never ids of people or money).
 */
export const acquisitionEventFor = (
  step: string,
  extra: { courseId?: string; inscriptionId?: string; [ignored: string]: unknown },
): { name: PublicEventName; extra: TrackEventExtra } | undefined => {
  if (!MIRRORED_STEPS.has(step)) return undefined;
  return {
    name: step as PublicEventName,
    extra: {
      ...(extra.courseId === undefined ? {} : { courseId: extra.courseId }),
      key: `${step}_${extra.courseId || ''}_${extra.inscriptionId || ''}`,
    },
  };
};

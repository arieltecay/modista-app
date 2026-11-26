import { expect, it, vi } from 'vitest';
import { getEnrollmentAttribution } from './enrollmentAttribution';

it('keeps enrollment data usable when browser storage is unavailable', () => {
  vi.stubGlobal('window', {});
  vi.stubGlobal('sessionStorage', { getItem: () => { throw new Error('storage blocked'); } });
  vi.stubGlobal('localStorage', { getItem: () => { throw new Error('storage blocked'); } });

  expect(getEnrollmentAttribution()).toEqual({
    marketingSource: 'organic',
    utmParams: {},
    sessionId: undefined,
    metaFbc: undefined,
    metaFbp: undefined,
  });
  vi.unstubAllGlobals();
});

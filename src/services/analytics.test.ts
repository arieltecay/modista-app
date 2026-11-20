import { afterEach, expect, it, vi } from 'vitest';
import { trackPurchaseSuccess } from './analytics';

vi.mock('../utils/privacy-consent', () => ({ hasMarketingConsent: () => true }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it('sends Purchase once when the pixel becomes available after the confirmed payment', () => {
  const storage = new Map<string, string>();
  const fbq = vi.fn();
  const browser: { fbq?: typeof fbq; dataLayer: unknown[]; location: URL } = {
    dataLayer: [],
    location: new URL('https://example.test/payment/success'),
  };
  vi.stubEnv('PROD', true);
  vi.stubGlobal('window', browser);
  vi.stubGlobal('localStorage', { getItem: () => null });
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });

  trackPurchaseSuccess('test-id', 'Curso de prueba', 100, 'test-course');
  expect(browser.dataLayer).toHaveLength(1);
  expect(fbq).not.toHaveBeenCalled();

  browser.fbq = fbq;
  trackPurchaseSuccess('test-id', 'Curso de prueba', 100, 'test-course');
  trackPurchaseSuccess('test-id', 'Curso de prueba', 100, 'test-course');

  expect(browser.dataLayer).toHaveLength(1);
  expect(fbq).toHaveBeenCalledExactlyOnceWith(
    'track', 'Purchase', expect.objectContaining({ value: 100, currency: 'ARS' }),
    { eventID: 'purchase_test-id' },
  );

  storage.set('purchase_fired_legacy-id', '1');
  trackPurchaseSuccess('legacy-id', 'Curso de prueba', 100, 'test-course');
  expect(fbq).toHaveBeenCalledTimes(1);
  expect(browser.dataLayer).toHaveLength(1);
});

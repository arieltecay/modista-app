import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PrivacyConsentBanner from './index';

const stubStoredChoice = (marketing: boolean | null) => {
  const raw = marketing === null
    ? null
    : JSON.stringify({ marketing, version: 'privacy-2026-11', updatedAt: new Date().toISOString() });
  vi.stubGlobal('localStorage', { getItem: () => raw });
};

describe('PrivacyConsentBanner', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('renders nothing on screen once the visitor already chose', () => {
    stubStoredChoice(false);

    expect(renderToStaticMarkup(<PrivacyConsentBanner />)).toBe('');
  });

  it('asks new visitors with both choices visible', () => {
    stubStoredChoice(null);

    const html = renderToStaticMarkup(<PrivacyConsentBanner />);

    expect(html).toContain('Solo necesarias');
    expect(html).toContain('Aceptar');
    expect(html).toContain('/privacidad');
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OPEN_PRIVACY_PREFERENCES_EVENT, openPrivacyPreferences } from '../../utils/privacy-consent';
import { PrivacyPreferencesButton } from './index';

describe('PrivacyPreferencesButton', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('renders an accessible text button', () => {
    const html = renderToStaticMarkup(<PrivacyPreferencesButton className="x" />);

    expect(html).toContain('type="button"');
    expect(html).toContain('Preferencias de privacidad');
  });

  it('asks the banner to open through a window event', () => {
    const dispatchEvent = vi.fn();
    vi.stubGlobal('window', { dispatchEvent });

    openPrivacyPreferences();

    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: OPEN_PRIVACY_PREFERENCES_EVENT }));
  });
});

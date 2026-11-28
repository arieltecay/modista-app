import { openPrivacyPreferences } from '../../utils/privacy-consent';
import type { PrivacyPreferencesButtonProps } from './types';

/** Discreet footer entry to reopen the consent panel (replaces the old floating button). */
export const PrivacyPreferencesButton = ({ className }: PrivacyPreferencesButtonProps) => (
  <button type="button" onClick={openPrivacyPreferences} className={className}>
    Preferencias de privacidad
  </button>
);

export interface PrivacyConsentState {
  choice: boolean | null;
  settingsOpen: boolean;
  saving: boolean;
  error: string | null;
}

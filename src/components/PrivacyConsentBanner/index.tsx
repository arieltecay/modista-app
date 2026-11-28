import { useEffect, useRef, useState } from 'react';
import {
  getMarketingConsentChoice,
  META_MARKETING_CONSENT_EVENT,
  OPEN_PRIVACY_PREFERENCES_EVENT,
  saveMarketingConsent,
} from '../../utils/privacy-consent';
import type { PrivacyConsentState } from './types';

const PrivacyConsentBanner = () => {
  const [state, setState] = useState<PrivacyConsentState>({
    choice: getMarketingConsentChoice(),
    settingsOpen: false,
    saving: false,
    error: null,
  });

  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (state.settingsOpen) panelRef.current?.focus();
  }, [state.settingsOpen]);

  useEffect(() => {
    const syncChoice = () => {
      setState(previous => ({ ...previous, choice: getMarketingConsentChoice() }));
    };
    const openSettings = () => {
      setState(previous => ({ ...previous, settingsOpen: true, error: null }));
    };
    window.addEventListener(META_MARKETING_CONSENT_EVENT, syncChoice);
    window.addEventListener(OPEN_PRIVACY_PREFERENCES_EVENT, openSettings);
    return () => {
      window.removeEventListener(META_MARKETING_CONSENT_EVENT, syncChoice);
      window.removeEventListener(OPEN_PRIVACY_PREFERENCES_EVENT, openSettings);
    };
  }, []);

  const handleChoice = async (marketingConsent: boolean) => {
    setState(previous => ({ ...previous, saving: true, error: null }));
    try {
      const requiresReload = await saveMarketingConsent(marketingConsent);
      if (requiresReload) {
        window.location.reload();
        return;
      }
      setState(previous => ({
        ...previous,
        choice: marketingConsent,
        settingsOpen: false,
        saving: false,
      }));
    } catch {
      setState(previous => ({
        ...previous,
        choice: marketingConsent ? previous.choice : false,
        saving: false,
        error: marketingConsent
          ? 'No pudimos registrar tu aceptación. Las herramientas seguirán desactivadas.'
          : 'Guardamos tu rechazo en este dispositivo, pero no pudimos confirmar la revocación en el servidor. Volveremos a intentarlo al reconectar.',
      }));
    }
  };

  if (state.choice !== null && !state.settingsOpen) return null;

  const closeSettings = () => setState(previous => ({ ...previous, settingsOpen: false }));

  return (
    <section
      ref={panelRef}
      tabIndex={-1}
      onKeyDown={event => {
        if (event.key === 'Escape' && state.choice !== null) closeSettings();
      }}
      aria-label="Preferencias de privacidad y medición"
      className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom)+0.5rem)] z-[100] rounded-xl border border-atelier-sage/20 bg-white/95 p-3.5 text-atelier-dark shadow-lg backdrop-blur outline-none sm:inset-x-auto sm:bottom-24 sm:right-4 sm:max-w-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-5 text-atelier-muted-text">
          Con tu permiso usamos Meta, Google y Clarity para medir visitas y mejorar anuncios. Puedes cambiarlo cuando quieras.{' '}
          <a href="/privacidad" className="underline">Más info</a>
        </p>
        {state.choice !== null && (
          <button
            type="button"
            onClick={closeSettings}
            className="-mr-2 -mt-2 rounded p-2 text-lg leading-none text-atelier-muted-text"
            aria-label="Cerrar preferencias"
          >
            ×
          </button>
        )}
      </div>
      {state.error && <p role="alert" className="mt-2 text-xs text-red-700">{state.error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={state.saving}
          onClick={() => void handleChoice(false)}
          className="flex-1 rounded-full border border-atelier-sage/40 px-3 py-2.5 text-xs font-semibold disabled:opacity-60"
        >
          Solo necesarias
        </button>
        <button
          type="button"
          disabled={state.saving}
          onClick={() => void handleChoice(true)}
          className="flex-1 rounded-full bg-atelier-primary px-3 py-2.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          Aceptar
        </button>
      </div>
    </section>
  );
};

export default PrivacyConsentBanner;

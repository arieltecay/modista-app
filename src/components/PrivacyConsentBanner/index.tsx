import { useEffect, useState } from 'react';
import {
  getMarketingConsentChoice,
  META_MARKETING_CONSENT_EVENT,
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

  useEffect(() => {
    const syncChoice = () => {
      setState(previous => ({ ...previous, choice: getMarketingConsentChoice() }));
    };
    window.addEventListener(META_MARKETING_CONSENT_EVENT, syncChoice);
    return () => window.removeEventListener(META_MARKETING_CONSENT_EVENT, syncChoice);
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

  const shouldShowPanel = state.choice === null || state.settingsOpen;

  return (
    <>
      {!shouldShowPanel && (
        <button
          type="button"
          onClick={() => setState(previous => ({ ...previous, settingsOpen: true, error: null }))}
          className="fixed bottom-3 left-3 z-[100] rounded-full border border-atelier-sage/30 bg-white px-4 py-2 text-xs font-semibold text-atelier-primary shadow-lg"
          aria-label="Abrir preferencias de privacidad"
        >
          Preferencias de privacidad
        </button>
      )}

      {shouldShowPanel && (
        <section
          aria-label="Preferencias de privacidad y medición"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-atelier-sage/20 bg-white p-5 text-atelier-dark shadow-2xl sm:inset-x-6 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-base font-bold">Privacidad y medición</h2>
            {state.choice !== null && (
              <button
                type="button"
                onClick={() => setState(previous => ({ ...previous, settingsOpen: false }))}
                className="rounded p-1 text-lg leading-none text-atelier-muted-text"
                aria-label="Cerrar preferencias"
              >
                ×
              </button>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-atelier-muted-text">
            Si aceptas, cargaremos herramientas opcionales de medición y publicidad, incluidas Meta Pixel/CAPI, Google Tag Manager y Microsoft Clarity. Pueden recibir eventos de navegación y compra, datos técnicos e identificadores del navegador. Puedes cambiar tu elección cuando quieras. <a href="/privacidad" className="underline">Lee la política de privacidad</a>.
          </p>
          {state.error && <p role="alert" className="mt-3 text-sm text-red-700">{state.error}</p>}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={state.saving}
              onClick={() => void handleChoice(false)}
              className="rounded-full border border-atelier-sage/40 px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              Solo necesarias
            </button>
            <button
              type="button"
              disabled={state.saving}
              onClick={() => void handleChoice(true)}
              className="rounded-full bg-atelier-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              Aceptar medición y publicidad
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default PrivacyConsentBanner;

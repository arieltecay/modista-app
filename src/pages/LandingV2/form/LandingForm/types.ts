export interface LandingFormState {
  fullName: string;
  email: string;
  celular: string;
  /** Honeypot anti-bots */
  website: string;
}

export type LandingFormField = 'fullName' | 'email' | 'celular';

/** Estados del flujo de submit con texto visible para la usuaria */
export type SubmitPhase = 'idle' | 'creating' | 'tracking' | 'redirecting';

export const SUBMIT_PHASE_LABEL: Record<Exclude<SubmitPhase, 'idle'>, string> = {
  creating: 'Creando tu inscripción…',
  tracking: 'Confirmando…',
  redirecting: 'Redirigiendo a MercadoPago…',
};

export interface FormMessageState {
  type: 'success' | 'error' | 'info';
  text: string;
}

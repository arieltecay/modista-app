import React, { useMemo } from 'react';
import { Spinner } from '@/components';
import { useLandingForm } from './use-landing-form';
import { SUBMIT_PHASE_LABEL } from './types';
import type { LandingFormField } from './types';
import type { CourseData, LandingPageData } from '../../types';

interface LandingFormProps {
  course: CourseData;
  landing: LandingPageData;
}

const FORM_FIELDS: Array<{
  name: LandingFormField;
  label: string;
  placeholder: string;
  type: string;
  autoComplete: string;
}> = [
  { name: 'fullName', label: 'Nombre y Apellido', placeholder: 'Ej: María García', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Tu mejor Email', placeholder: 'maria@ejemplo.com', type: 'email', autoComplete: 'email' },
  { name: 'celular', label: 'Tu WhatsApp de contacto', placeholder: '+54 9 11 ...', type: 'tel', autoComplete: 'tel' },
];

/**
 * Formulario de inscripción de la landing v2 — COMPONENTE PRESENTACIONAL.
 * Toda la lógica (validación, submit, conversión) vive en `useLandingForm`.
 */
const LandingForm: React.FC<LandingFormProps> = ({ course, landing }) => {
  const form = useLandingForm({ course, landing });

  const formattedPrice = useMemo(
    () =>
      course.price
        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(course.price)
        : null,
    [course.price]
  );

  return (
    <form onSubmit={form.handleSubmit} className="space-y-5" noValidate>
      {FORM_FIELDS.map((field) => {
        const error = form.fieldErrors[field.name];
        return (
          <div key={field.name}>
            <label htmlFor={`v2-${field.name}`} className="block text-sm font-semibold text-[#444842] mb-1.5 ml-1 font-atelier-sans">
              {field.label}
            </label>
            <input
              id={`v2-${field.name}`}
              ref={(el) => {
                form.fieldRefs.current[field.name] = el;
              }}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              inputMode={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : undefined}
              placeholder={field.placeholder}
              value={form.formData[field.name]}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              onFocus={() => form.handleFocus(field.name)}
              onBlur={() => form.handleBlur(field.name)}
              aria-invalid={!!error}
              aria-describedby={error ? `v2-${field.name}-error` : undefined}
              className={`w-full px-4 py-4 rounded-xl border-2 bg-atelier-canvas font-atelier-sans text-atelier-ink placeholder:text-atelier-muted-text/60 outline-none transition-all focus:bg-white focus:ring-4 ${
                error
                  ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-atelier-sage/30 focus:ring-atelier-primary/10 focus:border-atelier-primary'
              }`}
            />
            {error && (
              <p id={`v2-${field.name}-error`} role="alert" className="text-red-600 text-xs font-medium mt-1.5 ml-1 font-atelier-sans">
                {error}
              </p>
            )}
          </div>
        );
      })}

      {/* Honeypot anti-bots: invisible para humanos, los bots lo completan.
          Si llega con valor, el backend responde éxito falso sin crear nada. */}
      <input
        type="text"
        name="website"
        value={form.formData.website}
        onChange={(e) => form.setFieldValue('website', e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-0 h-0 opacity-0 pointer-events-none"
      />

      <div className="pt-3">
        <button
          type="submit"
          disabled={form.loading}
          className="group relative w-full bg-atelier-pop hover:bg-atelier-pop-dark active:scale-[0.98] text-white py-5 px-4 rounded-full shadow-lg shadow-atelier-pop/25 transition-all flex flex-col items-center justify-center disabled:opacity-60 overflow-hidden mb-3 min-h-[76px]"
        >
          <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" aria-hidden="true" />

          {form.loading ? (
            <>
              <Spinner />
              <span className="text-sm text-white/90 mt-2 font-atelier-sans">
                {SUBMIT_PHASE_LABEL[form.phase as Exclude<typeof form.phase, 'idle'>]}
              </span>
            </>
          ) : (
            <>
              <span className="text-lg sm:text-xl font-bold uppercase tracking-wide font-atelier-sans">
                {landing.buttonText || 'QUIERO EMPEZAR AHORA'}
              </span>
              {formattedPrice && (
                <span className="text-sm font-medium text-white/90 normal-case mt-1 font-atelier-sans">
                  <strong className="text-white font-bold">{formattedPrice}</strong> · pago único
                </span>
              )}
            </>
          )}
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[11px] text-atelier-muted-text text-center font-atelier-sans">
            Pagás con MercadoPago · Tarjetas, transferencia o efectivo
          </p>
          <div className="flex items-center gap-2 text-[10px] text-atelier-muted-text font-atelier-sans">
            <span>🔒 Pago seguro</span>
            <span className="text-atelier-muted-text/40">|</span>
            <span>📥 Acceso inmediato</span>
          </div>
        </div>
      </div>

      {form.formMessage && (
        <div
          ref={form.messageRef}
          role={form.formMessage.type === 'error' ? 'alert' : 'status'}
          className={`text-center p-4 rounded-xl text-sm font-bold font-atelier-sans ${
            form.formMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
              : form.formMessage.type === 'info'
                ? 'bg-atelier-gold/10 text-atelier-gold border border-atelier-gold/30'
                : 'bg-red-500/10 text-red-600 border border-red-500/20'
          }`}
        >
          {form.formMessage.text}
        </div>
      )}
    </form>
  );
};

export default LandingForm;

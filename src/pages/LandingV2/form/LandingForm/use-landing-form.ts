import React, { useRef, useState } from 'react';
import { createLandingInscription } from '../../../../services/inscriptions';
import { trackFormStart, trackFormError, trackFormFieldFocus, trackInscriptionSuccess, trackEnrollmentDiagnostic } from '../../../../services/analytics';
import { resolveCheckoutDestination } from '../../../../services/payment/checkoutDestination';
import { getEnrollmentAttribution } from '../../../../services/inscriptions/enrollmentAttribution';
import {
  validateEmailAddress,
  validateFullName,
  validatePhone,
  validatePhoneStrict,
} from '../../../../utils/validators';
import { trackV2 } from '../../hooks/use-landing-tracking';
import type { LandingFormField, LandingFormState, SubmitPhase, FormMessageState } from './types';
import type { CourseData, LandingPageData } from '../../types';
import type { CreateLandingInscriptionData } from '../../../../services/types';

export interface UseLandingFormArgs {
  course: CourseData;
  landing: LandingPageData;
}

// Primer foco = form_start (una sola vez por montaje del form)
let hasTrackedFormStart = false;

/**
 * Toda la lógica del formulario de cierre de venta de la landing v2
 * (state, validación en vivo, submit con cadena de conversión intacta).
 * El componente queda puramente presentacional.
 *
 * CADENA DE CONVERSIÓN PRESERVADA (no reordenar):
 *   validar → form_submit → POST /inscriptions/landing → InitiateCheckout pixel
 *   (eventID checkout_<id>) → await Lead pixel (eventID lead_<id>) →
 *   redirect_to_payment → delay 1500ms → redirect a MercadoPago.
 */
export const useLandingForm = ({ course, landing }: UseLandingFormArgs) => {
  const [formData, setFormData] = useState<LandingFormState>({ fullName: '', email: '', celular: '', website: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LandingFormField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<LandingFormField, boolean>>>({});
  const [phase, setPhase] = useState<SubmitPhase>('idle');
  const [formMessage, setFormMessage] = useState<FormMessageState | null>(null);

  const messageRef = useRef<HTMLDivElement | null>(null);
  const fieldRefs = useRef<Partial<Record<LandingFormField, HTMLInputElement | null>>>({});
  const submittingRef = useRef(false);

  React.useEffect(() => {
    return () => {
      hasTrackedFormStart = false;
    };
  }, []);

  const courseId = course.uuid || course.id || course._id;
  const loading = phase !== 'idle';

  const VALIDATORS: Record<LandingFormField, (v: string) => string | null> = {
    fullName: validateFullName,
    email: validateEmailAddress,
    celular: validatePhone,
  };

  const setFieldValue = (name: LandingFormField | 'website', value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validación en vivo solo si el campo ya fue tocado (no agresiva al tipear)
    if (name !== 'website' && touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: VALIDATORS[name](value) || undefined }));
    }
  };

  const handleBlur = (name: LandingFormField) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: VALIDATORS[name](formData[name]) || undefined }));
  };

  const handleFocus = (fieldName: LandingFormField) => {
    trackFormFieldFocus('landing_form_v2', 'Landing V2 Form', fieldName);
    if (!hasTrackedFormStart) {
      hasTrackedFormStart = true;
      trackV2('form_start', { courseId, courseTitle: course.title });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return; // doble-submit guard

    const nextErrors: Partial<Record<LandingFormField, string>> = {};
    const nextTouched: Partial<Record<LandingFormField, boolean>> = {};
    (Object.keys(VALIDATORS) as LandingFormField[]).forEach((name) => {
      const error = VALIDATORS[name](formData[name]);
      if (error) nextErrors[name] = error;
      nextTouched[name] = true;
    });
    setFieldErrors(nextErrors);
    setTouched(nextTouched);

    const firstErrorField = (Object.keys(VALIDATORS) as LandingFormField[]).find((name) => nextErrors[name]);
    if (firstErrorField) {
      trackEnrollmentDiagnostic('validation_failed');
      // Error visible: llevamos a la usuaria directo al campo con problema
      trackFormError('landing_form_v2', 'Landing V2 Form', firstErrorField, nextErrors[firstErrorField] || 'validation');
      fieldRefs.current[firstErrorField]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fieldRefs.current[firstErrorField]?.focus({ preventScroll: true });
      return;
    }

    submittingRef.current = true;
    setPhase('creating');

    let strictPhoneError: string | null = null;
    try {
      strictPhoneError = await validatePhoneStrict(formData.celular);
    } catch {
      // Si un deploy dejó el chunk diferido momentáneamente inaccesible, la
      // validación básica ya aplicada no debe bloquear una compra legítima.
      trackFormError('landing_form_v2', 'Landing V2 Form', 'celular', 'strict_validation_unavailable');
    }
    if (strictPhoneError) {
      setFieldErrors((previous) => ({ ...previous, celular: strictPhoneError }));
      setPhase('idle');
      submittingRef.current = false;
      trackFormError('landing_form_v2', 'Landing V2 Form', 'celular', strictPhoneError);
      fieldRefs.current.celular?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fieldRefs.current.celular?.focus({ preventScroll: true });
      return;
    }

    setFormMessage(null);
    trackEnrollmentDiagnostic('submitted');
    trackV2('form_submit', { courseId, courseTitle: course.title });

    let responseInvalid = false;
    try {
      const payload: CreateLandingInscriptionData = {
        fullName: formData.fullName,
        email: formData.email,
        celular: formData.celular,
        courseId: courseId as string,
        courseTitle: course.title,
        coursePrice: course.price,
        landingPageId: (landing._id || landing.id || '') as string,
        ...getEnrollmentAttribution(),
        website: formData.website,
      };

      const response = await createLandingInscription(payload);
      const inscriptionId = response.data?._id || response.data?.id;
      if (!inscriptionId) {
        responseInvalid = true;
        throw new Error('No pudimos completar tu inscripción. Intentá de nuevo o contactanos.');
      }
      trackEnrollmentDiagnostic('created');

      setPhase('tracking');

      try {
        // InitiateCheckout y Lead comparten eventID con el backend CAPI.
        trackFormStart('landing_form_v2', 'Landing V2 Form', payload.courseId, course.title, inscriptionId, course.price);
        await trackInscriptionSuccess(
          payload.courseId,
          course.title,
          course.price,
          inscriptionId
        );
      } catch {
        trackEnrollmentDiagnostic('analytics_failed');
      }

      if (inscriptionId) {
        trackV2('lead', { courseId: payload.courseId, courseTitle: course.title, inscriptionId, value: course.price });
        trackV2('initiate_checkout', { courseId: payload.courseId, courseTitle: course.title, inscriptionId, value: course.price });
      }

      // Prioridad: preference dinámica (mpInitPoint) > fallback estático (mpPaymentLink).
      const destination = resolveCheckoutDestination({
        coursePrice: Number(response.data?.coursePrice ?? course.price),
        inscriptionId,
        isDevelopment: import.meta.env.DEV,
        mpInitPoint: response.mpInitPoint,
        sandboxInitPoint: response.sandboxInitPoint,
        mpPaymentLink: response.mpPaymentLink,
      });

      if (destination) {
        setPhase('redirecting');
        trackEnrollmentDiagnostic(destination.kind === 'recovery' ? 'checkout_unavailable' : 'payment_redirect_attempt');
        if (destination.kind === 'payment') {
          trackV2('redirect_to_payment', {
            courseId: payload.courseId,
            courseTitle: course.title,
            inscriptionId,
          });
        }
        // Delay que protege la entrega del evento Lead del pixel antes de salir
        window.setTimeout(() => {
          window.location.href = destination.url;
        }, destination.kind === 'recovery' ? 0 : 1500);
        return;
      }

      setPhase('idle');
      submittingRef.current = false;
      setFormMessage({ type: 'success', text: '¡Inscripción exitosa! Revisá tu email para completar el pago.' });
    } catch (error) {
      trackEnrollmentDiagnostic(responseInvalid ? 'response_invalid' : 'api_failed');
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la inscripción';
      setPhase('idle');
      submittingRef.current = false;

      // Caso especial: ya inscripta → mensaje amable (no error rojo plano)
      const isDuplicate = /ya te encuentras inscripto/i.test(errorMessage);
      setFormMessage({
        type: isDuplicate ? 'info' : 'error',
        text: isDuplicate
          ? 'Ya tenés una inscripción con este email para este curso. Si no recibiste el correo o el link de pago, contactanos por WhatsApp.'
          : errorMessage,
      });
      trackFormError('landing_form_v2', 'Landing V2 Form', 'submit', errorMessage);
      // Auto-scroll al mensaje para que no quede fuera de pantalla en mobile
      window.setTimeout(() => messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
  };

  return {
    formData,
    fieldErrors,
    phase,
    loading,
    formMessage,
    messageRef,
    fieldRefs,
    setFieldValue,
    handleBlur,
    handleFocus,
    handleSubmit,
  };
};

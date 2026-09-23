import React, { useRef, useState } from 'react';
import { createLandingInscription } from '../../../../services/inscriptions';
import { trackFormStart, trackFormError, trackFormFieldFocus, trackInscriptionSuccess } from '../../../../services/analytics';
import { validateEmailAddress, validateFullName, validatePhone } from '../../../../utils/validators';
import { getUTMPayload, getStoredUTMData } from '../../../../utils/utm-tracking';
import { getCookieValue } from '../../../../utils/cookies';
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
      // Error visible: llevamos a la usuaria directo al campo con problema
      trackFormError('landing_form_v2', 'Landing V2 Form', firstErrorField, nextErrors[firstErrorField] || 'validation');
      fieldRefs.current[firstErrorField]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fieldRefs.current[firstErrorField]?.focus({ preventScroll: true });
      return;
    }

    setFormMessage(null);
    trackV2('form_submit', { courseId, courseTitle: course.title });

    submittingRef.current = true;
    setPhase('creating');

    try {
      const utmData = getStoredUTMData();
      const sessionId = localStorage.getItem('modista_session_id');

      const payload: CreateLandingInscriptionData = {
        fullName: formData.fullName,
        email: formData.email,
        celular: formData.celular,
        courseId: courseId as string,
        courseTitle: course.title,
        coursePrice: course.price,
        landingPageId: (landing._id || landing.id || '') as string,
        marketingSource: utmData?.source || 'organic',
        utmParams: getUTMPayload(),
        sessionId: sessionId || undefined,
        metaFbc: utmData?.fbc || getCookieValue('_fbc'),
        metaFbp: utmData?.fbp || getCookieValue('_fbp'),
        website: formData.website,
      };

      const response = await createLandingInscription(payload);
      const inscriptionId = response.data?._id || response.data?.id;

      setPhase('tracking');

      if (inscriptionId) {
        // InitiateCheckout (pixel) con el mismo eventID que el backend CAPI
        trackFormStart('landing_form_v2', 'Landing V2 Form', payload.courseId, course.title, inscriptionId, course.price);
      }

      // Lead (pixel) con mismo eventID que CAPI. Esperamos el encolado (~600ms).
      await trackInscriptionSuccess(
        payload.courseId,
        course.title,
        course.price,
        formData.email,
        formData.celular,
        inscriptionId
      );

      // Prioridad: preference dinámica (mpInitPoint) > fallback estático (mpPaymentLink).
      const initPoint = import.meta.env.DEV
        ? (response.sandboxInitPoint || response.mpInitPoint)
        : response.mpInitPoint;

      if (initPoint || response.mpPaymentLink) {
        setPhase('redirecting');
        trackV2('redirect_to_payment', {
          courseId: payload.courseId,
          courseTitle: course.title,
          inscriptionId: inscriptionId as string | undefined,
        });
        // Delay que protege la entrega del evento Lead del pixel antes de salir
        window.setTimeout(() => {
          window.location.href = initPoint || response.mpPaymentLink!;
        }, 1500);
        return;
      }

      setPhase('idle');
      submittingRef.current = false;
      setFormMessage({ type: 'success', text: '¡Inscripción exitosa! Revisá tu email para completar el pago.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la inscripción';
      setPhase('idle');
      submittingRef.current = false;

      // Caso especial: ya inscripta → mensaje amable (no error rojo plano)
      const isDuplicate = /ya te encuentras inscripto/i.test(errorMessage);
      setFormMessage({
        type: isDuplicate ? 'info' : 'error',
        text: isDuplicate
          ? 'Ya tenés una inscripción con este email para este curso. Revisá tu correo: ahí está tu link de pago.'
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

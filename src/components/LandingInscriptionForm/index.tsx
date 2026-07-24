import React, { useState, ChangeEvent, FormEvent } from 'react';
import { createLandingInscription } from '../../services/inscriptions';
import { 
  trackFormStart, 
  trackFormError, 
  trackInscriptionSuccess, 
  trackFormFieldFocus 
} from '../../services/analytics';
import { Spinner } from '@/components';
import { validateEmail, validateCelular } from '../../utils/formValidations';
import { getStoredUTMData } from '../../utils/utm-tracking';
import { 
  LandingInscriptionFormProps, 
  FormState, 
  FormMessage, 
  CreateLandingInscriptionPayload 
} from './types';

const LandingInscriptionForm: React.FC<LandingInscriptionFormProps> = ({ course, landingPage }) => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    celular: '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [hasStartedFilling, setHasStartedFilling] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<FormState> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre es obligatorio';
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const celularError = validateCelular(formData.celular);
    if (celularError) newErrors.celular = celularError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!hasStartedFilling) {
      trackFormStart('landing_form', 'Landing Page Form', course.uuid || course.id, course.title);
      setHasStartedFilling(true);
    }

    setFormData({ ...formData, [name as keyof FormState]: value });
    if (errors[name as keyof FormState]) setErrors({ ...errors, [name as keyof FormState]: undefined });
  };

  const handleFocus = (fieldName: string) => {
    trackFormFieldFocus('landing_form', 'Landing Page Form', fieldName);
  };

  const getCookieValue = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const utmData = getStoredUTMData();
      const sessionId = localStorage.getItem('modista_session_id');
      
      const payload: CreateLandingInscriptionPayload = {
        fullName: formData.fullName,
        email: formData.email,
        celular: formData.celular,
        courseId: course.uuid || course.id || (course as any)._id,
        courseTitle: course.title,
        coursePrice: course.price,
        landingPageId: landingPage._id || landingPage.id || '',
        marketingSource: utmData?.source || 'organic',
        utmParams: utmData || {},
        sessionId: sessionId || undefined,
        metaFbc: utmData?.fbc || getCookieValue('_fbc'),
        metaFbp: utmData?.fbp || getCookieValue('_fbp'),
      };

      const response = await createLandingInscription(payload);
      const inscriptionId = response.data?._id || response.data?.id;

      // --- TRACKING DE ÉXITO (Conversión) ---
      // Esperamos explícitamente a que el tracking termine antes de navegar
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
        // navigator.sendBeacon garantiza que los eventos de tracking lleguen al servidor
        // incluso cuando el navegador abandona la pgina hacia Mercado Pago.
        // Es el estndar para este caso de uso (no depende de timeouts).
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const sessionId = localStorage.getItem('modista_session_id');
          navigator.sendBeacon(
            '/api/analytics/beacon',
            new Blob(
              [JSON.stringify({ event: 'redirect_to_payment', sessionId })],
              { type: 'application/json' }
            )
          );
        }
        // Delay aumentado para permitir que el Pixel del navegador y CAPI completen el envío
        // del evento Lead antes de salir de la página hacia MercadoPago.
        import('../../utils/funnel-tracker').then(({ trackFunnel }) => {
          trackFunnel('redirect_to_payment', { courseId: course.uuid || course.id || (course as any)._id, courseTitle: course.title, inscriptionId });
        });
        setTimeout(() => {
          window.location.href = initPoint || response.mpPaymentLink!;
        }, 1500);
        return;
      }

      setFormMessage({ type: 'success', text: '¡Inscripción exitosa! Revisa tu email para completar el pago.' });
    } catch (error: any) {
      const errorMessage = error.message || 'Error al procesar la inscripción';
      setFormMessage({ type: 'error', text: errorMessage });
      trackFormError('landing_form', 'Landing Page Form', 'submit', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formattedPrice = course.price
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(course.price)
    : null;

  return (
    <div className="w-full font-sans">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">
            Nombre y Apellido
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Ej: María García"
            value={formData.fullName}
            onChange={handleChange}
            onFocus={() => handleFocus('fullName')}
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.fullName ? 'border-red-500' : 'border-gray-800 bg-gray-900'} focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-white placeholder:text-gray-500`}
          />
          {errors.fullName && <p className="text-red-400 text-xs font-medium mt-1.5 ml-1">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">
            Tu mejor Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="maria@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-800 bg-gray-900'} focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-white placeholder:text-gray-500`}
          />
          {errors.email && <p className="text-red-400 text-xs font-medium mt-1.5 ml-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="celular" className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">
            Tu WhatsApp de contacto
          </label>
          <input
            id="celular"
            name="celular"
            type="tel"
            required
            placeholder="+54 9 11 ..."
            value={formData.celular}
            onChange={handleChange}
            onFocus={() => handleFocus('celular')}
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.celular ? 'border-red-500' : 'border-gray-800 bg-gray-900'} focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-white placeholder:text-gray-500`}
          />
          {errors.celular && <p className="text-red-400 text-xs font-medium mt-1.5 ml-1">{errors.celular}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 active:scale-[0.98] text-white py-5 px-4 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex flex-col items-center justify-center disabled:opacity-50 overflow-hidden"
          >
            {/* Brillo decorativo */}
            <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
            
            {loading ? (
              <Spinner className="w-7 h-7 text-white" />
            ) : (
              <>
                <span className="text-xs font-bold text-violet-200 tracking-[0.2em] uppercase mb-1">
                  Cupos limitados
                </span>
                <span className="text-xl font-black uppercase tracking-wide">
                  {landingPage.buttonText || 'RESERVAR MI LUGAR'}
                </span>
                {formattedPrice && (
                  <span className="text-sm font-medium text-violet-100 normal-case mt-1">
                    Precio único: <strong className="text-white font-bold">{formattedPrice}</strong>
                  </span>
                )}
              </>
            )}
          </button>
        </div>

        {formMessage && (
          <div className={`text-center p-4 rounded-xl text-sm font-bold ${formMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {formMessage.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default LandingInscriptionForm;

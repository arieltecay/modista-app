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

      if (inscriptionId) {
        trackFormStart('landing_form', 'Landing Page Form', payload.courseId, course.title, inscriptionId, course.price);
      }

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
    <div className="w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-[#444842] mb-1.5 ml-1">
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
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.fullName ? 'border-red-500' : 'border-[#7d8c7b]/30 bg-[#FDFBF7]'} focus:bg-white focus:ring-4 focus:ring-[#516050]/10 focus:border-[#516050] outline-none transition-all text-[#141b2b] placeholder:text-[#747872]/60`}
          />
          {errors.fullName && <p className="text-red-600 text-xs font-medium mt-1.5 ml-1">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#444842] mb-1.5 ml-1">
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
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-[#7d8c7b]/30 bg-[#FDFBF7]'} focus:bg-white focus:ring-4 focus:ring-[#516050]/10 focus:border-[#516050] outline-none transition-all text-[#141b2b] placeholder:text-[#747872]/60`}
          />
          {errors.email && <p className="text-red-600 text-xs font-medium mt-1.5 ml-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="celular" className="block text-sm font-semibold text-[#444842] mb-1.5 ml-1">
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
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.celular ? 'border-red-500' : 'border-[#7d8c7b]/30 bg-[#FDFBF7]'} focus:bg-white focus:ring-4 focus:ring-[#516050]/10 focus:border-[#516050] outline-none transition-all text-[#141b2b] placeholder:text-[#747872]/60`}
          />
          {errors.celular && <p className="text-red-600 text-xs font-medium mt-1.5 ml-1">{errors.celular}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-[#516050] hover:bg-[#4A5A4B] active:scale-[0.98] text-white py-5 px-4 rounded-full shadow-lg shadow-[#516050]/25 transition-all flex flex-col items-center justify-center disabled:opacity-50 overflow-hidden mb-3"
          >
            <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />

            {loading ? (
              <>
                <Spinner />
                <span className="text-sm text-[#d7e7d3] mt-2">Redirigiendo a MercadoPago...</span>
              </>
            ) : (
              <>
                <span className="text-xl font-bold uppercase tracking-wide">
                  {landingPage.buttonText || 'QUIERO EMPEZAR AHORA'}
                </span>
                {formattedPrice && (
                  <span className="text-sm font-medium text-[#d7e7d3] normal-case mt-1">
                    <strong className="text-white font-bold">{formattedPrice}</strong> · pago único
                  </span>
                )}
              </>
            )}
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[11px] text-[#747872] text-center">
              Pagás con MercadoPago · Tarjetas, transferencia o efectivo
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#747872]">
              <span>🔒 Pago seguro</span>
              <span className="text-[#747872]/40">|</span>
              <span>📥 Acceso inmediato</span>
            </div>
          </div>
        </div>

        {formMessage && (
          <div className={`text-center p-4 rounded-xl text-sm font-bold ${formMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
            {formMessage.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default LandingInscriptionForm;

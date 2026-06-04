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
import { ShieldCheckIcon, LockClosedIcon, CreditCardIcon } from '@heroicons/react/24/outline';
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
        marketingSource: utmData?.source || 'meta_ads',
        utmParams: utmData || {},
        sessionId: sessionId || undefined,
        metaFbc: utmData?.fbc,
        metaFbp: utmData?.fbp,
      };

      const response = await createLandingInscription(payload);

      // --- TRACKING DE ÉXITO (Conversión) ---
      // Enviamos email y celular para Enhanced Conversions de Google Ads
      trackInscriptionSuccess(
        payload.courseId, 
        course.title, 
        course.price, 
        formData.email, 
        formData.celular
      );

      if (response.mpPaymentLink) {
        // Delay técnico de 500ms para asegurar que el navegador envíe los beacons de tracking
        // antes de abandonar la página hacia Mercado Pago.
        setTimeout(() => {
          window.location.href = response.mpPaymentLink!;
        }, 500);
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

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 font-sans">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
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
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.fullName ? 'border-red-500' : 'border-gray-100 bg-gray-50'} focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-800 placeholder:text-gray-400`}
          />
          {errors.fullName && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
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
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-100 bg-gray-50'} focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-800 placeholder:text-gray-400`}
          />
          {errors.email && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="celular" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
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
            className={`w-full px-4 py-4 rounded-xl border-2 ${errors.celular ? 'border-red-500' : 'border-gray-100 bg-gray-50'} focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-800 placeholder:text-gray-400`}
          />
          {errors.celular && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{errors.celular}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-black py-5 rounded-xl text-xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? <Spinner className="w-7 h-7 text-white" /> : landingPage.buttonText || 'RESERVAR MI LUGAR'}
          </button>
        </div>

        {formMessage && (
          <div className={`text-center p-3 rounded-xl text-sm font-bold ${formMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {formMessage.text}
          </div>
        )}
      </form>

      {/* Trust Badges */}
      <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <ShieldCheckIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase">Privacidad Total</h4>
            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Sus datos están protegidos y se eliminan automáticamente tras finalizar el curso.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <LockClosedIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase">Transacciones Seguras</h4>
            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">No solicitamos ni guardamos datos de tarjetas. Todo el proceso es externo.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-orange-100 p-2 rounded-lg">
            <CreditCardIcon className="w-6 h-6 text-orange-600 flex-shrink-0" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase">Garantía Mercado Pago</h4>
            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Pago 100% verificado y seguro a través de la plataforma líder de Argentina.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingInscriptionForm;

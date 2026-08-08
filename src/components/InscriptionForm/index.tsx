import React, { useState, ChangeEvent, FormEvent } from 'react';
import { createInscription } from '../../services/inscriptions';
import { 
  trackFormStart, 
  trackFormError, 
  trackInscriptionSuccess, 
  trackFormFieldFocus 
} from '../../services/analytics';
import Spinner from '../Spinner';
import TurnoSelector from '../TurnoSelector';
import { validateNombre, validateApellido, validateEmail, validateCelular } from '../../utils/formValidations';
import { isCourseFree } from '../../utils/courseUtils';
import { getStoredUTMData } from '../../utils/utm-tracking';
import { InscriptionFormProps, InscriptionFormData, InscriptionFormErrors, FormMessage } from './types';

const InscriptionForm: React.FC<InscriptionFormProps> = ({ course }) => {
  const [formData, setFormData] = useState<InscriptionFormData>({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
  });
  const [selectedTurnoId, setSelectedTurnoId] = useState<string | null>(null);
  const [errors, setErrors] = useState<InscriptionFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [hasAvailableSpots, setHasAvailableSpots] = useState<boolean>(true);

  const validateForm = (): boolean => {
    if (course?.isPresencial && !hasAvailableSpots) {
      setFormMessage({ type: 'error', text: 'Lo sentimos, este taller ya no tiene cupos disponibles.' });
      return false;
    }
    const newErrors: InscriptionFormErrors = {};
    const nombreError = validateNombre(formData.nombre);
    if (nombreError) {
      newErrors.nombre = nombreError;
      trackFormError('inscription_form', 'Formulario de Inscripción', 'nombre', nombreError);
    }

    const apellidoError = validateApellido(formData.apellido);
    if (apellidoError) {
      newErrors.apellido = apellidoError;
      trackFormError('inscription_form', 'Formulario de Inscripción', 'apellido', apellidoError);
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      trackFormError('inscription_form', 'Formulario de Inscripción', 'email', emailError);
    }

    const celularError = validateCelular(formData.celular);
    if (celularError) {
      newErrors.celular = celularError;
      trackFormError('inscription_form', 'Formulario de Inscripción', 'celular', celularError);
    }

    if (course?.isPresencial && !selectedTurnoId) {
      const turnoError = 'Por favor, selecciona un horario disponible';
      newErrors.turno = turnoError;
      trackFormError('inscription_form', 'Formulario de Inscripción', 'turno', turnoError);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === 'celular') {
      const celularError = validateCelular(value);
      setErrors(prev => ({ ...prev, celular: celularError }));
    } else if (errors[name as keyof InscriptionFormErrors]) {
      setErrors(prev => ({ ...prev, [name as keyof InscriptionFormErrors]: null }));
    }
  };

  const handleFocus = (fieldName: string) => {
    trackFormFieldFocus('inscription_form', 'Formulario de Inscripción', fieldName);
  };

  const getCookieValue = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const utmData = getStoredUTMData();
      const sessionId = localStorage.getItem('modista_session_id');
      const inscriptionData = {
        ...formData,
        courseId: course?.id || course?._id || '1',
        courseTitle: course?.title || 'Curso por defecto',
        coursePrice: course?.price || 0,
        courseShortDescription: course?.shortDescription || 'Descripción corta por defecto',
        courseDeeplink: course?.deeplink || 'https://modista.app',
        dateYear: new Date().getFullYear(),
        turnoId: selectedTurnoId,
        marketingSource: utmData?.source || 'organic',
        utmParams: utmData || {},
        sessionId: sessionId || undefined,
        metaFbc: utmData?.fbc || getCookieValue('_fbc'),
        metaFbp: utmData?.fbp || getCookieValue('_fbp'),
      };

      const inscriptionResponse = await createInscription(inscriptionData);

      const inscriptionId = inscriptionResponse?.data?._id || inscriptionResponse?.data?.id;
      
      if (inscriptionId) {
        trackFormStart('inscription_form', 'Formulario de Inscripción', course?.id || course?._id, course?.title, inscriptionId, course?.price);
      }

      await trackInscriptionSuccess(
        course?.id || course?._id || '1',
        course?.title || 'Curso',
        parseFloat(course?.price?.toString() || '0'),
        formData.email,
        formData.celular,
        inscriptionId
      );

      const initPoint = import.meta.env.DEV
        ? (inscriptionResponse?.sandboxInitPoint || inscriptionResponse?.mpInitPoint)
        : inscriptionResponse?.mpInitPoint;

      if (initPoint) {
        import('../../utils/funnel-tracker').then(({ trackFunnel }) => {
          trackFunnel('redirect_to_payment', { courseId: course?.id || course?._id || '1', courseTitle: course?.title, inscriptionId });
        });
        setTimeout(() => {
          window.location.href = initPoint;
        }, 500);
        return;
      }

      if (inscriptionResponse?.mpPaymentLink) {
        import('../../utils/funnel-tracker').then(({ trackFunnel }) => {
          trackFunnel('redirect_to_payment', { courseId: course?.id || course?._id || '1', courseTitle: course?.title, inscriptionId });
        });
        setTimeout(() => {
          window.location.href = inscriptionResponse.mpPaymentLink!;
        }, 500);
        return;
      }

      setFormMessage({ type: 'success', text: '¡Gracias por inscribirte! Revisa tu correo para ver la confirmación. Nos pondremos en contacto contigo pronto.' });
      setFormData({ nombre: '', apellido: '', email: '', celular: '' });
      setSelectedTurnoId(null);

    } catch (error: any) {
      const errorMessage = error.message || 'Ocurrió un error al enviar tu inscripción. Por favor, intenta de nuevo.';
      setFormMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const isFree = isCourseFree(course?.price);
  const isBlocked = course?.isPresencial && !hasAvailableSpots;

  const formattedPrice = course?.price && !isFree
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(course.price))
    : null;

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-md border border-border">

          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            {isFree ? '¡Curso Gratuito!' : '¡Inscribite ahora!'}
          </h2>

          {!isFree && (
            <>
              <div className="flex items-center justify-center gap-2 mb-8">
                {[
                  { num: '1', label: 'Datos', active: true },
                  { num: '2', label: 'Pago', active: false },
                  { num: '3', label: 'Acceso', active: false },
                ].map((step, i) => (
                  <React.Fragment key={step.num}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      step.active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background/30 text-xs">
                        {step.num}
                      </span>
                      {step.label}
                    </div>
                    {i < 2 && (
                      <div className="w-6 h-px bg-border" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
                <p className="text-sm font-semibold text-primary mb-1">
                  Estás por anotarte a:
                </p>
                <h3 className="text-lg font-bold text-foreground mb-2">{course?.title}</h3>
                {formattedPrice && (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-green-600">{formattedPrice}</span>
                    <span className="text-sm text-muted-foreground">pago único</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className={!isFree ? 'bg-muted/50 p-6 rounded-lg' : 'bg-muted/50 p-6 rounded-lg mb-8'}>
            {!isFree && (
              <p className="text-sm text-center text-muted-foreground mb-5">
                Completá tus datos y serás redirigida a <strong className="text-foreground">MercadoPago</strong> para hacer el pago seguro. El acceso al curso se habilita al instante.
              </p>
            )}
            {isBlocked && (
              <p className="text-sm text-center text-red-500 font-semibold mb-5">
                El cupo para este taller está completo.
              </p>
            )}
            <form className={`space-y-4 ${isBlocked ? 'opacity-50 pointer-events-none' : ''}`} onSubmit={handleSubmit} noValidate>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-muted-foreground mb-1">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    onFocus={() => handleFocus('nombre')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground ${errors.nombre ? 'border-red-500' : 'border-border'
                      }`}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>

                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-muted-foreground mb-1">
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={handleChange}
                    onFocus={() => handleFocus('apellido')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground ${errors.apellido ? 'border-red-500' : 'border-border'
                      }`}
                    placeholder="Tu apellido"
                  />
                  {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground ${errors.email ? 'border-red-500' : 'border-border'
                    }`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="celular" className="block text-sm font-medium text-muted-foreground mb-1">
                  Número de celular
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Ingresa tu número con código de país (ej. +54 para Argentina). Ej: +543811234567 o 543811234567
                </p>
                <input
                  id="celular"
                  name="celular"
                  type="tel"
                  required
                  value={formData.celular}
                  onChange={handleChange}
                  onFocus={() => handleFocus('celular')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground ${errors.celular ? 'border-red-500' : 'border-border'
                    }`}
                  placeholder="Ej: +543811234567"
                />
                {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
              </div>

              {course?.isPresencial && (
                <div className="pt-2">
                  <TurnoSelector
                    courseId={course.id || course._id || ''}
                    onSelect={(id) => {
                      setSelectedTurnoId(id);
                      setErrors(prev => ({ ...prev, turno: null }));
                    }}
                    selectedTurnoId={selectedTurnoId}
                    onAvailabilityChange={setHasAvailableSpots}
                  />
                  {errors.turno && <p className="text-red-500 text-sm mt-1">{errors.turno}</p>}
                </div>
              )}

              <div className="flex flex-col items-center space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || isBlocked}
                  className="w-full bg-primary text-primary-foreground py-3.5 px-6 rounded-xl text-lg font-bold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-primary/50 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <Spinner />
                  ) : isBlocked ? (
                    'Cupos Agotados'
                  ) : isFree ? (
                    'Acceder Gratis'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Ir a Pagar {formattedPrice}
                    </span>
                  )}
                </button>

                {!isFree && (
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      Pago seguro MP
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      Acceso al instante
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                      Soporte WhatsApp
                    </span>
                  </div>
                )}
              </div>
              {formMessage && (
                <div className={`text-center p-3 rounded-md mt-4 ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {formMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InscriptionForm;

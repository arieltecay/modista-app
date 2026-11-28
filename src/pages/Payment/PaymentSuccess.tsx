import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePaymentStatusPolling, type PollingOutcome } from '../../components/PaymentReturnHandler';
import { trackPurchaseSuccess } from '../../services/analytics';
import { META_PIXEL_READY_EVENT } from '../../services/meta-pixel';
import { useMarketingConsent } from '../../hooks/use-marketing-consent';
import type { AccessNotificationStatus, PaymentStatusResponse, PaymentStatusValue } from '../../services/payment/types';
import Spinner from '../../components/Spinner';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '../../utils/constants';
import { PrivacyPreferencesButton } from '../../components/PrivacyPreferencesButton';

const whatsappUrl = buildWhatsAppUrl(WHATSAPP_MESSAGES.paymentSuccess);

type AccessNotifications = { email: AccessNotificationStatus; whatsapp: AccessNotificationStatus };

const keepPollingNotifications = (data: PaymentStatusResponse): boolean =>
  data.paymentStatus === 'paid' && (data.accessNotifications?.email === 'pending' || data.accessNotifications?.whatsapp === 'pending');

export const getSuccessCopy = (status: PaymentStatusValue, notifications?: AccessNotifications, outcome: PollingOutcome = 'resolved') => {
  if (status === 'partial') return {
    heading: '¡Pago parcial registrado!',
    intro: 'Recibimos tu pago parcial. Te avisaremos cuando se complete el pago.',
    details: 'Revisá el correo que ingresaste al inscribirte para seguir las novedades.',
  };
  if (notifications?.whatsapp === 'disabled') {
    if (notifications.email === 'accepted') return {
      heading: '¡Pago confirmado!',
      intro: 'Tu pago está registrado.',
      details: 'Te enviamos la confirmación y los detalles del curso solo al correo que ingresaste al inscribirte. Revisá tu bandeja de entrada.',
    };
    return {
      heading: '¡Pago confirmado!',
      intro: 'Tu pago está registrado.',
      details: outcome === 'resolved' && notifications.email === 'pending'
        ? 'Estamos enviando la confirmación y los detalles del curso al correo que ingresaste al inscribirte. Puede tardar unos minutos.'
        : 'Revisá el correo que ingresaste al inscribirte. Todavía no pudimos confirmar el envío.',
    };
  }
  if (notifications?.email === 'accepted' && notifications.whatsapp === 'accepted') return {
    heading: '¡Pago confirmado!',
    intro: 'Tu pago está registrado.',
    details: 'Te enviamos la confirmación y los detalles del curso al correo y WhatsApp que ingresaste al inscribirte.',
  };
  return {
    heading: '¡Pago confirmado!',
    intro: 'Tu pago está registrado.',
    details: outcome === 'resolved' && notifications &&
      (notifications.email === 'pending' || notifications.email === 'accepted') &&
      (notifications.whatsapp === 'pending' || notifications.whatsapp === 'accepted') &&
      (notifications.email === 'pending' || notifications.whatsapp === 'pending')
      ? 'Estamos enviando el acceso al correo y WhatsApp que ingresaste al inscribirte. Puede tardar unos minutos.'
      : 'Revisá el correo y WhatsApp que ingresaste al inscribirte. Todavía no pudimos confirmar ambos envíos.',
  };
};

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const inscriptionId = searchParams.get('inscription_id') || searchParams.get('external_reference');
  const [snapshot, setSnapshot] = useState<{ inscriptionId: string; data: PaymentStatusResponse } | null>(null);
  const [pollingState, setPollingState] = useState<{ inscriptionId: string; outcome: PollingOutcome } | null>(null);
  const paymentData = snapshot?.inscriptionId === inscriptionId ? snapshot.data : null;
  const outcome = pollingState?.inscriptionId === inscriptionId ? pollingState.outcome : 'resolved';
  const marketingConsent = useMarketingConsent();

  usePaymentStatusPolling({
    inscriptionId: inscriptionId || '',
    continueWhile: keepPollingNotifications,
    onUpdate: (data, oc) => {
      if (data && Object.keys(data).length) setSnapshot({ inscriptionId: inscriptionId || '', data });
      setPollingState({ inscriptionId: inscriptionId || '', outcome: oc });
    },
  });

  const isPaid = paymentData?.paymentStatus === 'paid';

  useEffect(() => {
    if (!isPaid || !inscriptionId || !paymentData) return;
    if (!marketingConsent) return;

    const trackPurchase = () => {
      trackPurchaseSuccess(inscriptionId, paymentData.courseTitle, paymentData.totalPaid || paymentData.coursePrice, paymentData.courseId);
    };
    window.addEventListener(META_PIXEL_READY_EVENT, trackPurchase);
    trackPurchase();
    return () => window.removeEventListener(META_PIXEL_READY_EVENT, trackPurchase);
  }, [isPaid, paymentData, inscriptionId, marketingConsent]);

  useEffect(() => {
    if (!isPaid || !inscriptionId || !paymentData) return;
    import('../../utils/funnel-tracker').then(({ trackFunnel }) => {
      trackFunnel('purchase', { courseId: paymentData.courseId, courseTitle: paymentData.courseTitle, inscriptionId, value: paymentData.totalPaid || paymentData.coursePrice });
    });
  }, [isPaid, paymentData, inscriptionId]);

  if (!inscriptionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ID de inscripción no encontrado</h1>
        <p className="text-gray-600 mb-6">No pudimos identificar tu pago. Por favor contactanos por WhatsApp.</p>
        <a
          href={whatsappUrl}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <FaWhatsapp size={20} /> Contactar por WhatsApp
        </a>
        <PrivacyPreferencesButton className="mt-6 text-xs text-gray-400 underline-offset-4 hover:underline" />
      </div>
    );
  }

  const showPaid = paymentData?.paymentStatus === 'paid' || paymentData?.paymentStatus === 'partial';
  const copy = showPaid ? getSuccessCopy(paymentData.paymentStatus, paymentData.accessNotifications, outcome) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <div className="flex min-h-[22rem] w-full max-w-md flex-col justify-center rounded-2xl bg-white p-8 text-center shadow-lg">
        {showPaid ? (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {copy?.heading}
            </h1>
            <p className="text-gray-600 mb-1">
              {copy?.intro}
            </p>
            {paymentData?.courseTitle && (
              <p className="text-sm text-gray-500 mb-2">
                Curso: <span className="font-semibold">{paymentData.courseTitle}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
              {copy?.details}
            </p>
          </>
        ) : (
          <>
            <Spinner />
            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              {outcome === 'timeout' ? 'Estamos procesando tu pago...' : 'Verificando tu pago...'}
            </h1>
            <p className="text-gray-600 mb-4">
              {outcome === 'timeout'
                ? 'Puede tardar unos segundos más. Te avisaremos por email cuando esté confirmado.'
                : 'MercadoPago nos está notificando. Esto suele tardar menos de 30 segundos.'}
            </p>
            {outcome === 'timeout' && (
              <a
                href={whatsappUrl}
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp size={18} /> Contactar por WhatsApp
              </a>
            )}
          </>
        )}
        <PrivacyPreferencesButton className="mt-6 text-xs text-gray-400 underline-offset-4 hover:underline" />
      </div>
    </div>
  );
};

export default PaymentSuccess;

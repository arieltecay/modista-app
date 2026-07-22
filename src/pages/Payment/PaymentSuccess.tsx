import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePaymentStatusPolling } from '../../components/PaymentReturnHandler';
import { trackPurchaseSuccess } from '../../services/analytics';
import type { PaymentStatusResponse } from '../../services/payment/types';
import Spinner from '../../components/Spinner';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '../../utils/constants';

const whatsappUrl = buildWhatsAppUrl(WHATSAPP_MESSAGES.paymentSuccess);

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const inscriptionId = searchParams.get('inscription_id') || searchParams.get('external_reference');
  const [paymentData, setPaymentData] = useState<PaymentStatusResponse | null>(null);
  const [outcome, setOutcome] = useState<'resolved' | 'timeout' | 'error'>('resolved');

  usePaymentStatusPolling({
    inscriptionId: inscriptionId || '',
    onUpdate: (data, oc) => {
      if (data && Object.keys(data).length) setPaymentData(data);
      setOutcome(oc);
    },
  });

  const isPaid = outcome === 'resolved' && paymentData?.paymentStatus === 'paid';

  useEffect(() => {
    if (!isPaid || !inscriptionId || !paymentData) return;
    trackPurchaseSuccess(inscriptionId, paymentData.courseTitle, paymentData.totalPaid || paymentData.coursePrice);
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
      </div>
    );
  }

  const showPaid = outcome === 'resolved' && (paymentData?.paymentStatus === 'paid' || paymentData?.paymentStatus === 'partial');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg">
        {showPaid ? (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {paymentData?.paymentStatus === 'paid' ? '¡Pago confirmado!' : '¡Pago parcial registrado!'}
            </h1>
            <p className="text-gray-600 mb-2">
              {paymentData?.paymentStatus === 'paid'
                ? 'Tu lugar está reservado.'
                : `Recibimos tu pago parcial. El saldo se confirmará por email.`}
            </p>
            {paymentData?.courseTitle && (
              <p className="text-sm text-gray-500 mb-6">
                Curso: <span className="font-semibold">{paymentData.courseTitle}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Te enviamos un email con los detalles de acceso.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <FaWhatsapp size={20} /> Contactar por WhatsApp
              </a>
              <Link
                to="/cursos"
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ver más cursos
              </Link>
            </div>
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
      </div>
    </div>
  );
};

export default PaymentSuccess;

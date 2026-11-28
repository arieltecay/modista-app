import { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { usePaymentStatusPolling } from '../../components/PaymentReturnHandler';
import { FaClock, FaWhatsapp } from 'react-icons/fa';
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '../../utils/constants';
import { PrivacyPreferencesButton } from '../../components/PrivacyPreferencesButton';

const whatsappUrl = buildWhatsAppUrl(WHATSAPP_MESSAGES.paymentPending);

const PaymentPending: React.FC = () => {
  const [searchParams] = useSearchParams();
  const inscriptionId = searchParams.get('inscription_id') || searchParams.get('external_reference');
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');

  usePaymentStatusPolling({
    inscriptionId: inscriptionId || '',
    onUpdate: (data) => {
      if (data?.paymentStatus) setPaymentStatus(data.paymentStatus);
    },
  });

  if (paymentStatus === 'paid' || paymentStatus === 'partial') {
    return <Navigate to={`/payment/success?inscription_id=${encodeURIComponent(inscriptionId || '')}`} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
      <div className="flex min-h-[22rem] w-full max-w-md flex-col justify-center rounded-2xl bg-white p-8 text-center shadow-lg">
        <FaClock className="text-6xl text-amber-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tu pago está siendo procesado</h1>
        <p className="text-gray-600 mb-6">
          Si pagaste con transferencia o en efectivo, puede demorar unas horas en acreditarse. Te avisaremos por email cuando se confirme.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={whatsappUrl}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <FaWhatsapp size={20} /> Consultar por WhatsApp
          </a>
          <Link
            to="/cursos"
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Ver más cursos
          </Link>
        </div>
        <PrivacyPreferencesButton className="mt-6 text-xs text-gray-400 underline-offset-4 hover:underline" />
      </div>
    </div>
  );
};

export default PaymentPending;

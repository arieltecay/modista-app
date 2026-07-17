import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePaymentStatusPolling } from '../../components/PaymentReturnHandler';
import { createPreferenceForInscription } from '../../services/payment/paymentService';
import { FaTimesCircle, FaWhatsapp, FaRedo } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WHATSAPP_URL = 'https://wa.me/5493813508796?text=' + encodeURIComponent('Hola, tuve un problema con el pago de un curso en Modista.');

const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const inscriptionId = searchParams.get('inscription_id') || searchParams.get('external_reference');
  const [retrying, setRetrying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');

  usePaymentStatusPolling({
    inscriptionId: inscriptionId || '',
    onUpdate: (data) => {
      if (data?.paymentStatus) setPaymentStatus(data.paymentStatus);
    },
  });

  // Si por algún motivo el pago terminó aprobado (a veces MP redirige a failure pero el pago pasó),
  // mostramos un mensaje positivo en vez del de error.
  if (paymentStatus === 'paid' || paymentStatus === 'partial') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-700">¡Tu pago fue confirmado! Te enviamos los detalles por email.</p>
          <Link to="/" className="mt-4 inline-block px-6 py-3 bg-[var(--color-green-600)] text-white rounded-lg">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const handleRetry = async () => {
    if (!inscriptionId) return;
    setRetrying(true);
    try {
      const { initPoint } = await createPreferenceForInscription(inscriptionId);
      window.location.href = initPoint;
    } catch {
      toast.error('No se pudo generar el link de pago. Contactanos por WhatsApp.');
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">No pudimos procesar el pago</h1>
        <p className="text-gray-600 mb-6">
          Puede deberse a fondos insuficientes, datos incorrectos o un problema con el medio de pago. Tu inscripción sigue activa.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={retrying || !inscriptionId}
            className="px-6 py-3 bg-[var(--color-green-600)] text-white rounded-lg hover:bg-[var(--color-green-800)] transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
          >
            <FaRedo size={18} /> {retrying ? 'Generando link...' : 'Intentar de nuevo'}
          </button>
          <a
            href={WHATSAPP_URL}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <FaWhatsapp size={20} /> Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;

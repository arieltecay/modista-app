import { useEffect, useRef, useState } from 'react';
import { getPaymentStatus } from '../../services/payment/paymentService';
import type { PaymentStatusResponse, PaymentStatusValue } from '../../services/payment/types';

export type PollingOutcome = 'resolved' | 'timeout' | 'error';

interface PaymentReturnHandlerProps {
  inscriptionId: string;
  /** Se llama cuando el status pasa a 'paid' o 'partial', o cuando expira el polling. */
  onUpdate: (data: PaymentStatusResponse, outcome: PollingOutcome) => void;
  /** Polling cada X ms. Default 2000. */
  intervalMs?: number;
  /** Cantidad máxima de intentos. Default 15 (30s total). */
  maxAttempts?: number;
}

/**
 * Hook + componente que hace polling a GET /api/payment/status/:inscriptionId
 * tras el redirect de MercadoPago. El webhook es la fuente de verdad;
 * este polling es solo UX para mostrar feedback inmediato sin refresh.
 */
export const usePaymentStatusPolling = ({
  inscriptionId,
  onUpdate,
  intervalMs = 2000,
  maxAttempts = 15,
}: PaymentReturnHandlerProps) => {
  const [status, setStatus] = useState<PaymentStatusValue>('pending');
  const [isPolling, setIsPolling] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;

    const tick = async () => {
      if (cancelled) return;
      attempt += 1;
      setAttempts(attempt);

      try {
        const data = await getPaymentStatus(inscriptionId);
        if (cancelled) return;

        setStatus(data.paymentStatus);

        if (data.paymentStatus === 'paid' || data.paymentStatus === 'partial') {
          setIsPolling(false);
          onUpdateRef.current(data, 'resolved');
          return;
        }
      } catch {
        if (cancelled) return;
        onUpdateRef.current({} as PaymentStatusResponse, 'error');
      }

      if (attempt >= maxAttempts) {
        setIsPolling(false);
        onUpdateRef.current({} as PaymentStatusResponse, 'timeout');
        return;
      }

      setTimeout(tick, intervalMs);
    };

    tick();

    return () => {
      cancelled = true;
    };
  }, [inscriptionId, intervalMs, maxAttempts]);

  return { status, isPolling, attempts };
};

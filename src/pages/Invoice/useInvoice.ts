import { useCallback, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { getPublicInvoice } from '../../services/invoice/invoiceService';
import type { InvoiceLoadState } from './types';

const TOKEN_IN_PATH = /^\/factura\/([^/]+)\/?$/;

/** Loads the invoice named by the current url and draws its ARCA QR. `reload` retries after an error. */
export const useInvoice = (): { state: InvoiceLoadState; reload: () => void } => {
  const [state, setState] = useState<InvoiceLoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const token = window.location.pathname.match(TOKEN_IN_PATH)?.[1] ?? '';

    const load = async () => {
      setState({ status: 'loading' });
      try {
        const invoice = await getPublicInvoice(token);
        if (cancelled) return;
        if (!invoice) {
          setState({ status: 'not_found' });
          return;
        }
        const qrDataUrl = await QRCode.toDataURL(invoice.fiscalQrUrl, { margin: 0, errorCorrectionLevel: 'M', width: 220 });
        if (!cancelled) setState({ status: 'ready', invoice, qrDataUrl });
      } catch {
        if (!cancelled) setState({ status: 'error' });
      }
    };
    void load();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);
  return { state, reload };
};

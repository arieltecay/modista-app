export interface InvoiceData {
  /** `homologation` = comprobante de prueba, sin validez fiscal. */
  environment: 'homologation' | 'production';
  emitter: { legalName: string; cuit: string; address: string; ivaCondition: string };
  receiver: { name: string };
  pointOfSale: number;
  number: number;
  /** Instante de emisión (ISO). */
  issuedAt: string;
  lines: Array<{ description: string; quantity: number; unitPrice: number }>;
  total: number;
  cae: string;
  /** Vencimiento del CAE, AAAA-MM-DD. */
  caeExpiresAt: string;
  fiscalQrUrl: string;
}

export type InvoiceLoadState =
  | { status: 'loading' }
  | { status: 'ready'; invoice: InvoiceData; qrDataUrl: string }
  | { status: 'not_found' }
  | { status: 'error' };

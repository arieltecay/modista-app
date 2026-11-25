export interface InvoiceSheetLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceSheetProps {
  invoice: {
    /** `homologation` = comprobante de prueba, sin validez fiscal. */
    environment: 'homologation' | 'production';
    emitter: { legalName: string; cuit: string; address: string; ivaCondition: string };
    receiver: { name: string };
    pointOfSale: number;
    number: number;
    /** Instante de emisión (ISO). */
    issuedAt: string;
    lines: InvoiceSheetLine[];
    total: number;
    cae: string;
    /** Vencimiento del CAE, AAAA-MM-DD. */
    caeExpiresAt: string;
    /** Solo en notas de crédito: la factura que anulan. */
    creditedInvoice?: { pointOfSale: number; number: number };
  };
  /** QR ya dibujado (data URL); mientras no llega se reserva su lugar. */
  qrDataUrl?: string;
}

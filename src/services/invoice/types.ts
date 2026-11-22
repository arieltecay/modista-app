export interface PublicInvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

/** Lo que la API entrega de una factura autorizada; nunca incluye el mail ni IDs internos. */
export interface PublicInvoice {
  /** `homologation` marca comprobantes de prueba, sin validez fiscal. */
  environment: 'homologation' | 'production';
  emitter: { legalName: string; cuit: string; address: string; ivaCondition: string };
  receiver: { name: string };
  pointOfSale: number;
  number: number;
  /** Instante de emisión (ISO). */
  issuedAt: string;
  lines: PublicInvoiceLine[];
  total: number;
  cae: string;
  /** Vencimiento del CAE, AAAA-MM-DD. */
  caeExpiresAt: string;
  fiscalQrUrl: string;
}

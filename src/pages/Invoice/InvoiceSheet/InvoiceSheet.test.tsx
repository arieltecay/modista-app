import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InvoiceSheet } from './index';
import type { InvoiceSheetProps } from './types';

const invoice: InvoiceSheetProps['invoice'] = {
  environment: 'production',
  emitter: { legalName: 'Emisor', cuit: '1', address: 'Calle', ivaCondition: 'Responsable Monotributo' },
  receiver: { name: 'Ana' },
  pointOfSale: 3,
  number: 2,
  issuedAt: '2026-11-25T18:00:00Z',
  lines: [{ description: 'Curso', quantity: 1, unitPrice: 20900 }],
  total: 20900,
  cae: '1',
  caeExpiresAt: '2026-12-05',
};

describe('InvoiceSheet', () => {
  it('prints an invoice as Factura, code 011', () => {
    const html = renderToStaticMarkup(<InvoiceSheet invoice={invoice} />);

    expect(html).toContain('>FACTURA<');
    expect(html).toContain('COD. 011');
    expect(html).not.toContain('Comprobante asociado');
  });

  it('prints a credit note as such, code 013, with the invoice it cancels', () => {
    const html = renderToStaticMarkup(<InvoiceSheet invoice={{ ...invoice, creditedInvoice: { pointOfSale: 3, number: 6 } }} />);

    expect(html).toContain('>NOTA DE CRÉDITO<');
    expect(html).toContain('COD. 013');
    expect(html).not.toContain('>FACTURA<');
    expect(html).toContain('Factura C 00003-00000006');
  });
});

import { formatAmount, formatDate, formatPlainDate, padNumber } from '../utils/format';
import type { InvoiceSheetProps } from './types';

const ARCA_LEGEND = 'Esta Agencia no se responsabiliza por los datos ingresados en el detalle de la operación';
const TEST_NOTICE = 'COMPROBANTE DE PRUEBA · SIN VALIDEZ FISCAL';

/** Factura C (o la Nota de Crédito C que la anula) a consumidor final con el formato oficial de ARCA: solo datos, una copia. */
export const InvoiceSheet = ({ invoice, qrDataUrl }: InvoiceSheetProps) => {
  const issued = formatDate(invoice.issuedAt);
  const { emitter, receiver, creditedInvoice } = invoice;

  return (
    <article className="mx-auto max-w-3xl border border-black bg-white p-3 text-[13px] text-black print:max-w-none">
      {invoice.environment === 'homologation' && (
        <p role="note" className="mb-2 border border-amber-500 bg-amber-100 px-2 py-1 text-center text-xs font-bold">
          {TEST_NOTICE}
        </p>
      )}

      <p className="border-b border-black pb-1.5 text-center font-bold">ORIGINAL</p>

      <header className="flex border-b border-black">
        <div className="flex-1 p-2.5">
          <p className="text-base font-bold">{emitter.legalName}</p>
          <p>
            <b>Razón Social:</b> {emitter.legalName}
          </p>
          <p>
            <b>Domicilio Comercial:</b> {emitter.address}
          </p>
          <p>
            <b>Condición frente al IVA:</b> {emitter.ivaCondition}
          </p>
        </div>
        <div className="mt-2 h-fit w-16 shrink-0 border border-black p-1 text-center">
          <b className="block text-3xl leading-none">C</b>
          <small className="text-[9px]">{creditedInvoice ? 'COD. 013' : 'COD. 011'}</small>
        </div>
        <div className="flex-1 p-2.5">
          <p className="text-2xl font-bold">{creditedInvoice ? 'NOTA DE CRÉDITO' : 'FACTURA'}</p>
          <p>
            Punto de Venta: <b>{padNumber(invoice.pointOfSale, 5)}</b> &nbsp; Comp. Nro: <b>{padNumber(invoice.number, 8)}</b>
          </p>
          <p>
            Fecha de Emisión: <b>{issued}</b>
          </p>
          <p>
            <b>CUIT:</b> {emitter.cuit}
          </p>
        </div>
      </header>

      <div className="flex flex-wrap justify-between gap-x-4 border-b border-black px-2.5 py-2">
        <span>Período Facturado Desde: {issued}</span>
        <span>Hasta: {issued}</span>
        <span>Fecha de Vto. para el pago: {issued}</span>
      </div>

      <section className="border-b border-black px-2.5 py-2">
        <p>
          <b>Apellido y Nombre / Razón Social:</b> {receiver.name}
        </p>
        <p>
          <b>Condición frente al IVA:</b> Consumidor Final
        </p>
        <p>
          <b>Condición de venta:</b> Contado
        </p>
        {creditedInvoice && (
          <p>
            <b>Comprobante asociado:</b> {`Factura C ${padNumber(creditedInvoice.pointOfSale, 5)}-${padNumber(creditedInvoice.number, 8)}`}
          </p>
        )}
      </section>

      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-1">Producto / Servicio</th>
            <th className="p-1 text-right">Cantidad</th>
            <th className="p-1">U. Medida</th>
            <th className="p-1 text-right">Precio Unit.</th>
            <th className="p-1 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((line) => (
            <tr key={line.description}>
              <td className="p-1">{line.description}</td>
              <td className="p-1 text-right">{formatAmount(line.quantity)}</td>
              <td className="p-1">unidades</td>
              <td className="p-1 text-right">{formatAmount(line.unitPrice)}</td>
              <td className="p-1 text-right">{formatAmount(line.quantity * line.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-14 border border-black p-2 text-right">
        <p>
          Subtotal: $ <b>{formatAmount(invoice.total)}</b>
        </p>
        <p>
          Importe Otros Tributos: $ <b>0,00</b>
        </p>
        <p>
          Importe Total: $ <b>{formatAmount(invoice.total)}</b>
        </p>
      </div>

      <footer className="mt-3 flex items-center gap-3.5">
        <div className="h-24 w-24 shrink-0">
          {qrDataUrl && <img src={qrDataUrl} alt="Código QR de ARCA para verificar este comprobante" className="h-24 w-24" />}
        </div>
        <div className="flex-1">
          <b>ARCA</b>
          <small className="block text-gray-700">Agencia de Recaudación y Control Aduanero</small>
          <i>Comprobante Autorizado</i>
          <small className="block text-gray-700">{ARCA_LEGEND}</small>
        </div>
        <div className="text-right">
          <p>Pág. 1/1</p>
          <p>
            CAE N°: <b>{invoice.cae}</b>
          </p>
          <p>Fecha de Vto. de CAE: {formatPlainDate(invoice.caeExpiresAt)}</p>
        </div>
      </footer>
    </article>
  );
};

export default InvoiceSheet;

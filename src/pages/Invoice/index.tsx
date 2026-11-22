import { useEffect } from 'react';
import InvoiceSheet from './InvoiceSheet';
import { useInvoice } from './useInvoice';

const PRINT_STYLE = '@page { size: A4; margin: 10mm; } @media print { body { background: #fff; } }';

/** Sin buscadores ni referrer: la URL de la factura es un secreto. */
const hidePageFromCrawlersAndReferrers = (): void => {
  document.title = 'Tu factura';
  for (const [name, content] of [
    ['robots', 'noindex, nofollow'],
    ['referrer', 'no-referrer'],
  ]) {
    let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }
};

const Message = ({ title, text, action }: { title: string; text: string; action?: { label: string; onClick: () => void } }) => (
  <div role="alert" className="mx-auto mt-24 max-w-md rounded-lg bg-white p-8 text-center shadow">
    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    <p className="mt-2 text-gray-600">{text}</p>
    {action && (
      <button type="button" onClick={action.onClick} className="mt-5 rounded-lg bg-violet-800 px-5 py-2.5 font-semibold text-white">
        {action.label}
      </button>
    )}
  </div>
);

/**
 * Página pública `/factura/:token`. Se monta sola desde `main.jsx` (sin `App`), para que ningún script de
 * seguimiento (GTM, Pixel, Clarity, visitas) vea la URL ni el contenido de la factura.
 */
const InvoicePage = () => {
  const { state, reload } = useInvoice();

  useEffect(hidePageFromCrawlersAndReferrers, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 print:bg-white print:p-0">
      <style>{PRINT_STYLE}</style>

      {state.status === 'loading' && (
        <p role="status" className="mt-24 text-center text-gray-600">
          Cargando tu factura…
        </p>
      )}
      {state.status === 'not_found' && (
        <Message title="No encontramos esta factura" text="Revisá que el link esté completo o escribinos y te la reenviamos." />
      )}
      {state.status === 'error' && (
        <Message
          title="No pudimos cargar tu factura"
          text="Probá de nuevo en unos minutos."
          action={{ label: 'Reintentar', onClick: reload }}
        />
      )}
      {state.status === 'ready' && (
        <>
          <div className="mx-auto mb-3 flex max-w-3xl items-center justify-between print:hidden">
            <strong className="text-gray-900">Tu factura</strong>
            <button type="button" onClick={() => window.print()} className="rounded-lg bg-violet-800 px-5 py-2.5 text-sm font-semibold text-white">
              Imprimir / Guardar como PDF
            </button>
          </div>
          <InvoiceSheet invoice={state.invoice} qrDataUrl={state.qrDataUrl} />
        </>
      )}
    </div>
  );
};

export default InvoicePage;

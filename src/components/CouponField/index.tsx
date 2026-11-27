import { useState } from 'react';
import { validateCoupon } from '../../services/coupons/couponService';
import { checkCoupon } from '../../utils/couponCheck';
import { formatArs } from '../../utils/formatArs';
import type { CouponFieldProps } from './types';

const CouponField = ({ courseId, applied, onApply, onRemove, appearance = 'checkout' }: CouponFieldProps) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleApply = async () => {
    if (checking) return;
    setChecking(true);
    setMessage(null);
    const outcome = await checkCoupon(code, courseId, validateCoupon);
    setChecking(false);
    if (outcome.kind === 'applied') {
      onApply(outcome.coupon);
      setCode('');
      setOpen(false);
    } else {
      setMessage(outcome.message);
    }
  };

  if (applied) {
    return (
      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm">
        <p className="text-green-800">
          Cupón <strong>{applied.code}</strong> aplicado · Ahorrás <strong>{formatArs(applied.discountAmount)}</strong>
        </p>
        <button type="button" onClick={onRemove} className="shrink-0 font-semibold text-green-900 underline">
          Quitar
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={`mb-6 text-sm font-semibold underline ${appearance === 'landing' ? 'text-atelier-primary-dark' : 'text-primary'}`}>
        ¿Tenés un cupón de descuento?
      </button>
    );
  }

  return (
    <div className="mb-6">
      <label htmlFor="coupon-code" className={`mb-1 block text-sm font-medium ${appearance === 'landing' ? 'text-atelier-ink' : 'text-muted-foreground'}`}>
        Código de cupón
      </label>
      <div className="flex gap-2">
        <input
          id="coupon-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void handleApply();
            }
          }}
          autoComplete="off"
          className={`w-full min-w-0 rounded-lg border px-3 py-2 uppercase ${appearance === 'landing' ? 'border-atelier-sage/40 bg-atelier-canvas text-atelier-ink' : 'border-border bg-background text-foreground'}`}
        />
        <button
          type="button"
          onClick={() => void handleApply()}
          disabled={checking}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 ${appearance === 'landing' ? 'bg-atelier-primary text-white' : 'bg-primary text-primary-foreground'}`}
        >
          {checking ? 'Verificando…' : 'Aplicar'}
        </button>
      </div>
      {message && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default CouponField;

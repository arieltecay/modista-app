import React from 'react';

const steps = [
  { emoji: '📝', title: 'Completá tus datos', desc: 'Nombre, email y WhatsApp' },
  { emoji: '🔒', title: 'Pago seguro', desc: 'MercadoPago protege tu compra' },
  { emoji: '📥', title: 'Acceso inmediato', desc: 'Recibís el curso al instante' },
];

const badges = [
  '🔒 Pago seguro con MercadoPago',
  '💳 Tarjetas, transferencia o efectivo',
  '📥 Acceso inmediato al inscribirte',
  '🔄 Garantía de satisfacción',
];

/**
 * Seguridad + cómo funciona: contenido real de v1, layout v2.
 * La línea que une los pasos se dibuja con el motivo de costura punteada.
 */
const SecuritySection: React.FC = () => (
  <section className="py-12 px-4 sm:px-6 bg-white">
    <div className="max-w-xl mx-auto">
      <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold text-center mb-2 text-atelier-ink">
        Tu compra es 100% segura
      </h2>
      <p className="text-atelier-muted-text text-center text-sm mb-8 font-atelier-sans">
        Así de simple es empezar
      </p>

      <div className="relative mb-8">
        <div className="absolute left-6 right-6 border-t-2 border-dashed border-atelier-sage/40 hidden sm:block" style={{ top: '1.5rem' }} aria-hidden="true" />
        <div className="grid grid-cols-3 gap-3 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-atelier-canvas border-2 border-atelier-primary/25 flex items-center justify-center text-xl mb-3 z-10">
                <span aria-hidden="true">{step.emoji}</span>
              </div>
              <h3 className="text-atelier-ink font-semibold text-sm mb-1 font-atelier-sans">{step.title}</h3>
              <p className="text-atelier-muted-text text-xs leading-relaxed font-atelier-sans">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.map((text, i) => (
          <div key={i} className="bg-atelier-canvas rounded-xl px-4 py-3 flex items-center gap-2 border border-atelier-sage/10">
            <span className="text-atelier-ink text-xs font-atelier-sans">{text}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SecuritySection;

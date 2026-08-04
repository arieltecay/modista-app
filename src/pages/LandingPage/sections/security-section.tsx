import React from 'react';

const DocumentIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ShieldCheckIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DownloadIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const steps = [
  {
    Icon: DocumentIcon,
    title: 'Completá tus datos',
    desc: 'Nombre, email y WhatsApp',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Pago seguro',
    desc: 'MercadoPago protege tu compra',
  },
  {
    Icon: DownloadIcon,
    title: 'Acceso inmediato',
    desc: 'Recibís el curso al instante',
  },
];

const badges = [
  { icon: '🔒', text: 'Pago seguro con MercadoPago' },
  { icon: '💳', text: 'Tarjetas, transferencia o efectivo' },
  { icon: '📥', text: 'Acceso inmediato al inscribirte' },
  { icon: '🔄', text: 'Garantía de satisfacción' },
];

const SecuritySection: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-6 bg-[#FDFBF7]">
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-[#141b2b]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
          Tu compra es 100% segura
        </h2>
        <p className="text-[#747872] text-center text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Así de simple es empezar
        </p>

        <div className="relative mb-6">
          <div className="absolute top-8 left-0 right-0 h-px bg-[#7d8c7b]/20 hidden sm:block" style={{ top: '2rem' }} />
          <div className="grid grid-cols-3 gap-4 relative">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#7d8c7b]/30 flex items-center justify-center text-[#516050] mb-3 z-10">
                  <step.Icon />
                </div>
                <h3 className="text-[#141b2b] font-semibold text-sm mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{step.title}</h3>
                <p className="text-[#747872] text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge, i) => (
            <div key={i} className="bg-white rounded-xl p-3 flex items-start gap-2 shadow-[0_2px_8px_rgba(81,96,80,0.04)]">
              <span className="text-base flex-shrink-0">{badge.icon}</span>
              <span className="text-[#444842] text-xs leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
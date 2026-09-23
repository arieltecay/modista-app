import React from 'react';

const steps = [
  { emoji: '🧵', title: 'Elegí tu curso', desc: 'Buscá el proyecto que te entusiasme: prendas, moldes o técnicas.' },
  { emoji: '🔒', title: 'Inscribite en minutos', desc: 'Datos + pago seguro con MercadoPago. Sin vueltas.' },
  { emoji: '✂️', title: 'Empezá a coser', desc: 'Acceso inmediato y de por vida. A tu ritmo, con apoyo directo.' },
];

/** Método en 3 pasos con la línea de costura punteada (motivo de marca). */
const MethodSection: React.FC = () => (
  <section id="metodo" className="py-14 px-4 sm:px-6 bg-atelier-canvas">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-atelier-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 font-atelier-sans">
        Simple de verdad
      </p>
      <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold mb-10 text-atelier-ink">
        Cómo funciona
      </h2>

      <div className="relative">
        <div className="absolute left-8 right-8 border-t-2 border-dashed border-atelier-sage/40 hidden sm:block" style={{ top: '1.75rem' }} aria-hidden="true" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-4 sm:gap-0">
              <div className="w-14 h-14 shrink-0 rounded-full bg-white border-2 border-atelier-primary/25 flex items-center justify-center text-2xl sm:mb-4 z-10 shadow-sm">
                <span aria-hidden="true">{step.emoji}</span>
              </div>
              <div>
                <h3 className="text-atelier-ink font-semibold text-base mb-1 font-atelier-sans">{step.title}</h3>
                <p className="text-atelier-muted-text text-sm leading-relaxed font-atelier-sans">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default MethodSection;

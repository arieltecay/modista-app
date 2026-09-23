import React from 'react';

/**
 * Skeleton de página completa de la landing v2 (mobile + desktop).
 * Reproduce el layout real con dimensiones exactas → cero CLS al hidratar.
 */
const LandingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-atelier-canvas animate-pulse" aria-busy="true" aria-label="Cargando…">
    {/* Hero */}
    <div className="max-w-xl mx-auto px-5 pt-10 pb-12 text-center">
      <div className="h-6 w-44 bg-atelier-sage/15 rounded-full mx-auto mb-6" />
      <div className="h-10 bg-atelier-sage/15 rounded-xl mb-3" />
      <div className="h-10 w-3/4 bg-atelier-sage/15 rounded-xl mx-auto mb-7" />
      <div className="w-full max-w-[340px] mx-auto aspect-[4/5] bg-atelier-sage/15 rounded-3xl mb-7" />
      <div className="h-14 w-full sm:w-80 bg-atelier-sage/20 rounded-full mx-auto" />
    </div>

    {/* Beneficios */}
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="h-9 w-56 bg-atelier-sage/15 rounded-xl mx-auto mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-atelier-sage/10">
            <div className="h-8 w-8 bg-atelier-sage/15 rounded-lg mb-3" />
            <div className="h-5 w-2/3 bg-atelier-sage/15 rounded-lg mb-2" />
            <div className="h-4 w-full bg-atelier-sage/10 rounded-lg mb-1.5" />
            <div className="h-4 w-5/6 bg-atelier-sage/10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Form */}
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <div className="h-8 w-40 bg-atelier-sage/15 rounded-xl mx-auto mb-5" />
      <div className="bg-white rounded-3xl p-6 border border-atelier-sage/10 space-y-5">
        <div className="h-14 bg-atelier-sage/10 rounded-xl" />
        <div className="h-14 bg-atelier-sage/10 rounded-xl" />
        <div className="h-14 bg-atelier-sage/10 rounded-xl" />
        <div className="h-16 bg-atelier-sage/20 rounded-full" />
      </div>
    </div>
  </div>
);

export default LandingSkeleton;

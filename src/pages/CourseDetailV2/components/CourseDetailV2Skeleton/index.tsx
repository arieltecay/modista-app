import React from 'react';

/** Skeleton del Course Detail v2 con dimensiones del layout real (cero CLS). */
const CourseDetailV2Skeleton: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse" aria-busy="true" aria-label="Cargando curso…">
    <div className="h-4 w-48 bg-atelier-sage/15 rounded mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_380px] gap-8">
      <div>
        <div className="aspect-[4/3] bg-atelier-sage/15 rounded-3xl" />
        <div className="h-9 bg-atelier-sage/15 rounded-xl mt-6 w-3/4" />
        <div className="h-4 bg-atelier-sage/10 rounded mt-3 w-full" />
        <div className="h-4 bg-atelier-sage/10 rounded mt-2 w-5/6" />
      </div>
      <div className="bg-white rounded-3xl p-7 border border-atelier-sage/10">
        <div className="h-9 w-40 bg-atelier-sage/15 rounded-lg mb-4" />
        <div className="space-y-2.5">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-4 bg-atelier-sage/10 rounded" />)}
        </div>
        <div className="h-14 bg-atelier-sage/20 rounded-full mt-6" />
      </div>
    </div>
  </div>
);

export default CourseDetailV2Skeleton;

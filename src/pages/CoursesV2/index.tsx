import React, { useState } from 'react';
import V2Layout from '../../components/V2Layout';
import CourseCardV2 from '../../components/CourseCardV2';
import { SEO } from '@/components';
import { useVisibleCourses } from '../../hooks/use-visible-courses';

type FilterMode = 'all' | 'online' | 'presencial';

/**
 * Catálogo completo v2 (/v2/cursos): CourseCardV2 compartida y toggle simple
 * Online/Presencial (los únicos filtros reales del negocio).
 */
const CoursesV2: React.FC = () => {
  const { courses, loading } = useVisibleCourses();
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered = courses.filter((c) => {
    if (filter === 'online') return !c.isPresencial;
    if (filter === 'presencial') return c.isPresencial;
    return true;
  });

  return (
    <V2Layout>
      <SEO
        title="Cursos de Costura — Modista"
        description="Catálogo completo: cursos online de costura, moldería y diseño, y talleres presenciales en Tucumán."
      />

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-atelier-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 text-center font-atelier-sans">
            Catálogo
          </p>
          <h1 className="font-atelier-serif text-4xl sm:text-5xl font-semibold text-center mb-3 text-atelier-ink">
            Cursos y talleres
          </h1>
          <p className="text-atelier-muted-text text-center text-sm mb-8 max-w-md mx-auto font-atelier-sans">
            Todo lo que podés aprender conmigo, paso a paso y a tu ritmo.
          </p>

          {/* Toggle modalidad (los únicos filtros reales del negocio) */}
          <div className="flex justify-center gap-2 mb-10">
            {(
              [
                { key: 'all', label: 'Todos' },
                { key: 'online', label: 'Online' },
                { key: 'presencial', label: 'Presencial' },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all font-atelier-sans ${
                  filter === f.key
                    ? 'bg-atelier-primary text-white shadow-md shadow-atelier-primary/20'
                    : 'bg-white text-atelier-muted-text border border-atelier-sage/20 hover:border-atelier-primary/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-atelier-sage/15 rounded-2xl mb-3" />
                  <div className="h-5 bg-atelier-sage/15 rounded-lg w-3/4 mb-2" />
                  <div className="h-4 bg-atelier-sage/10 rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-atelier-muted-text text-sm font-atelier-sans py-10">
              No hay cursos {filter === 'presencial' ? 'presenciales' : filter === 'online' ? 'online' : ''} disponibles en este momento.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((course) => (
                <CourseCardV2 key={course.id || course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </V2Layout>
  );
};

export default CoursesV2;

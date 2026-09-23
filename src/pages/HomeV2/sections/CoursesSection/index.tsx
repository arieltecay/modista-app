import React from 'react';
import { Link } from 'react-router-dom';
import { useVisibleCourses } from '../../../../hooks/use-visible-courses';
import CourseCardV2 from '../../../../components/CourseCardV2';

/**
 * Grilla de cursos v2 (Home): usa el hook compartido useVisibleCourses
 * y CourseCardV2 (misma card en el catálogo).
 */
const CoursesSection: React.FC = () => {
  const { courses, loading } = useVisibleCourses();

  return (
    <section id="cursos" className="py-14 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="text-atelier-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 text-center font-atelier-sans">
          Catálogo
        </p>
        <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold text-center mb-3 text-atelier-ink">
          Elegí tu próximo proyecto
        </h2>
        <p className="text-atelier-muted-text text-center text-sm mb-10 max-w-md mx-auto font-atelier-sans">
          Cursos online para hacer a tu ritmo y talleres presenciales en Tucumán.
        </p>

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
        ) : courses.length === 0 ? (
          <p className="text-center text-atelier-muted-text text-sm font-atelier-sans">
            No hay cursos disponibles en este momento.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.slice(0, 6).map((course) => (
              <CourseCardV2 key={course.id || course._id} course={course} />
            ))}
          </div>
        )}

        {!loading && courses.length > 6 && (
          <div className="text-center mt-10">
            <Link
              to="/cursos"
              className="inline-flex items-center bg-atelier-primary hover:bg-atelier-primary-dark text-white text-sm font-bold uppercase tracking-wide px-8 py-3.5 rounded-full transition-all active:scale-[0.98] font-atelier-sans"
            >
              Ver todos los cursos →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;

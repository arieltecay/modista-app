
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CourseCard, Spinner, ErrorCard } from '@/components';
import { getCourses } from '../../services/courses';

function CoursesPage({ limit }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const coursesToShow = limit ? courses.slice(0, limit) : courses;
  const showMoreButton = limit && courses.length > limit;

  if (loading) {
    return <Spinner text="Cargando curso..." />;
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorCard
          title="No pudimos cargar los cursos"
          message={`Detalle: ${error}`}
          onRetry={fetchCourses}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nuestros Cursos
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Explora nuestra oferta educativa y encuentra el curso perfecto para ti.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coursesToShow.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {showMoreButton && (
          <div className="mt-10 text-center">
            <Link
              to="/cursos"
              className="inline-block bg-[var(--color-green-600)] text-gray-500 font-semibold py-3 px-8 rounded-lg hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-green-600)] focus:ring-opacity-50 transition-all duration-300"
            >
              Ver todos los cursos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;

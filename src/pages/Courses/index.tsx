import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CourseCard, ErrorCard } from '@/components';
import { getCourses } from '../../services/courses';
import FaqSection from '../../components/FaqSection/FaqSection';
import { sendAnalyticsEvent } from '../../services/analytics';

// Componente Esqueleto para carga visual elegante
const CourseCardSkeleton = () => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse flex flex-col h-full border border-gray-100">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-6 flex-grow space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
    <div className="p-6 pt-0 mt-auto flex flex-col items-center space-y-3">
      <div className="h-8 bg-gray-100 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
    </div>
  </div>
);

function CoursesPage({ limit }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime] = useState(performance.now());

  const fetchCourses = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCourses(limit);
      setCourses(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Tracking de rendimiento UX para GA4
  useEffect(() => {
    if (!loading && courses.length > 0) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      sendAnalyticsEvent('ux_performance', {
        event_category: 'UX Performance',
        event_action: 'courses_rendered',
        event_label: limit ? `home_limit_${limit}` : 'full_list',
        event_value: duration,
        non_interaction: true
      });
    }
  }, [loading, courses, limit, startTime]);

  const coursesToShow = courses;
  const showMoreButton = limit && courses.length >= limit;

  if (loading) {
    return (
      <div className="bg-gray-50 py-12" id="courses">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(limit || 6)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
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
      <FaqSection />
    </div>
  );
}

export default CoursesPage;

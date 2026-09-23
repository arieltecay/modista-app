import { useEffect, useState } from 'react';
import { getCourses } from '../services/courses/coursesService';
import type { Course } from '../services/courses/types';

/**
 * Cursos visibles para el público (status !== 'inactive').
 * Centraliza el fetch + filtro que estaba duplicado entre
 * HomeV2/CoursesSection y CoursesV2.
 */
export const useVisibleCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCourses()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setCourses(list.filter((c) => c.status !== 'inactive'));
      })
      .catch(() => {
        if (cancelled) return;
        setCourses([]);
        setError(true);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { courses, loading, error };
};

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../../services/courses';
import type { Course } from '../../Courses/types';
import { trackCourseView } from '../../../services/analytics';
import { isCourseFree, shouldShowInscription } from '../../../utils/courseUtils';
import { useCourseContext } from '../../../context/CourseContext';
import { trackV2, useScrollDepthTracking, usePricingVisibleOnce } from '../../LandingV2/hooks/use-landing-tracking';

export interface UseCourseDetailResult {
  course: Course | null;
  loading: boolean;
  error: string | null;
  isFree: boolean;
  formattedPrice: string | null;
  heroRef: React.RefObject<HTMLDivElement | null>;
  formRef: React.RefObject<HTMLDivElement | null>;
  priceRef: React.RefObject<HTMLDivElement | null>;
  showStickyCTA: boolean;
  scrollToForm: () => void;
}

/**
 * Datos + tracking + refs del Course Detail v2.
 * Encapsula: fetch del curso, ViewContent/detail_view, pricing_visible,
 * form_view (observer sobre el form), scroll depth, sticky CTA.
 * El componente queda puramente de presentación.
 */
export const useCourseDetail = (): UseCourseDetailResult => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const { setActiveCourse } = useCourseContext();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const priceRef = useRef<HTMLDivElement | null>(null);

  const courseId = useMemo(() => course?.id || course?.uuid || course?._id, [course]);
  const priceValue = course?.price ? Number(course.price) : undefined;
  const isFree = course ? isCourseFree(course.price) : false;

  useScrollDepthTracking({ courseId, courseTitle: course?.title, value: priceValue });
  usePricingVisibleOnce(priceRef, { courseId, courseTitle: course?.title, value: priceValue });

  const scrollToForm = useCallback(() => {
    trackV2('cta_click', { courseId, courseTitle: course?.title, value: priceValue });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [courseId, course?.title, priceValue]);

  // Fetch del curso + ViewContent (pixel/GTM vía trackCourseView) + contexto activo
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const foundCourse = await getCourseById(id);
        setCourse(foundCourse);
        if (foundCourse) {
          trackCourseView(foundCourse.id, foundCourse.title, parseFloat(foundCourse.price?.toString() || '0'));
          setActiveCourse(foundCourse);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    return () => setActiveCourse(null);
  }, [id, setActiveCourse]);

  // Paso 1 del funnel propio: course_detail_view (una vez por curso, dedupe en tracker)
  useEffect(() => {
    if (!courseId || !course?.title) return;
    trackV2('course_detail_view', { courseId, courseTitle: course.title, value: priceValue });
  }, [courseId, course?.title, priceValue]);

  // form_view cuando el form entra al viewport (refs, sin selectores frágiles)
  useEffect(() => {
    if (!course || !shouldShowInscription(course.price)) return;
    const target = formRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackV2('form_view', { courseId, courseTitle: course.title });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [course, courseId]);

  // Sticky CTA mobile cuando el hero sale del viewport
  useEffect(() => {
    if (!course || isCourseFree(course.price)) return;
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCTA(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [course, courseId]);

  const formattedPrice =
    course && Number(course.price) > 0
      ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(course.price))
      : null;

  return {
    course,
    loading,
    error,
    isFree,
    formattedPrice,
    heroRef,
    formRef,
    priceRef,
    showStickyCTA,
    scrollToForm,
  };
};

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getLandingPageBySlug, getLandingFullBySlug } from '../services/landing';
import { getCourseById } from '../services/courses';
import { getTestimonials } from '../services/testimonials/testimonialService';
import { trackCourseView } from '../services/analytics';
import { useCourseContext } from '../context/CourseContext';
import { getLandingHeroUrl } from '../utils/image-utils';
import { LandingPageData, CourseData, TestimonialItem } from '../types/landing';
import type { Testimonial } from '../services/types';

interface UseLandingDataResult {
  landing: LandingPageData | null;
  course: CourseData | null;
  testimonials: TestimonialItem[];
  loading: boolean;
  error: boolean;
}

interface LandingCache {
  landing: LandingPageData;
  course: CourseData;
  testimonials: TestimonialItem[];
}

const CACHE_PREFIX = 'modista_landing_v1_';

const readCache = (slug: string): LandingCache | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + slug);
    return raw ? (JSON.parse(raw) as LandingCache) : null;
  } catch {
    return null;
  }
};

const writeCache = (slug: string, data: LandingCache): void => {
  try {
    sessionStorage.setItem(CACHE_PREFIX + slug, JSON.stringify(data));
  } catch {
    return;
  }
};

const preloadLcpImage = (imageUrl?: string): void => {
  if (!imageUrl) return;
  const href = getLandingHeroUrl(imageUrl);
  if (!href || document.querySelector(`link[rel="preload"][href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = href;
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
};

/** Mapea el documento del API al shape que renderiza la landing. */
const mapTestimonial = (t: Testimonial): TestimonialItem => ({
  name: t.name,
  role: t.role || '',
  text: t.description,
  avatarUrl: t.avatarUrl || undefined,
});

export function useLandingData(): UseLandingDataResult {
  const { slug } = useParams<{ slug: string }>();
  const { setActiveCourse } = useCourseContext();
  const [landing, setLanding] = useState<LandingPageData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasData = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const fetchLandingData = async () => {
      if (!slug) return;

      const cached = readCache(slug);
      if (cached?.landing && cached?.course) {
        hasData.current = true;
        setLanding(cached.landing);
        setCourse(cached.course);
        setTestimonials(cached.testimonials || []);
        setActiveCourse(cached.course as any);
        setLoading(false);
        preloadLcpImage(cached.course.imageUrl);
      }

      try {
        let landingData: LandingPageData | null = null;
        let courseData: CourseData | null = null;
        let testimonialItems: TestimonialItem[] | null = null;

        // Camino rápido: landing + curso + testimonios en UNA llamada.
        try {
          const fullRes = await getLandingFullBySlug(slug);
          if (cancelled) return;
          if (fullRes.success && fullRes.data?.landing && fullRes.data?.course) {
            landingData = fullRes.data.landing as unknown as LandingPageData;
            courseData = fullRes.data.course as unknown as CourseData;

            const raw = Array.isArray(fullRes.data.testimonials) ? fullRes.data.testimonials : [];
            testimonialItems = raw.map(mapTestimonial);
          }
        } catch {
          // Endpoint combinado no disponible o error transitorio → fallback.
        }

        // Fallback: camino anterior (landing → curso), sin esperar testimonios.
        if (!landingData || !courseData) {
          const landingRes = await getLandingPageBySlug(slug);
          if (cancelled) return;
          if (landingRes.success && landingRes.data) {
            landingData = landingRes.data as unknown as LandingPageData;

            const cachedCourse = cached?.course && cached.landing?.courseId === landingData.courseId
              ? cached.course
              : null;

            const courseRes = cachedCourse
              ? await getCourseById(landingData.courseId).catch(() => cachedCourse)
              : await getCourseById(landingData.courseId);
            if (cancelled) return;
            courseData = courseRes as unknown as CourseData;
          }
        }

        if (landingData && courseData) {
          hasData.current = true;
          preloadLcpImage(courseData.imageUrl);
          setLanding(landingData);
          setCourse(courseData);
          setActiveCourse(courseData as any);
          setLoading(false);
          trackCourseView(courseData.id, courseData.title, courseData.price);

          if (testimonialItems === null) {
            // Solo en el fallback: testimonios no bloqueantes.
            writeCache(slug, { landing: landingData, course: courseData, testimonials: cached?.testimonials || [] });
            const courseIdForFilter = courseData.id || courseData._id;
            const res = await getTestimonials(courseIdForFilter).catch(() => [] as Testimonial[]);
            if (cancelled) return;
            testimonialItems = (Array.isArray(res) ? res : []).map(mapTestimonial);
          }
          setTestimonials(testimonialItems);
          writeCache(slug, { landing: landingData, course: courseData, testimonials: testimonialItems });
        } else if (!hasData.current) {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
        if (!hasData.current) {
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLandingData();

    return () => {
      cancelled = true;
    };
  }, [slug, setActiveCourse]);

  return { landing, course, testimonials, loading, error };
}

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getLandingPageBySlug } from '../../../services/landing';
import { getCourseById } from '../../../services/courses';
import { trackCourseView } from '../../../services/analytics';
import { useCourseContext } from '../../../context/CourseContext';
import { getOptimizedUrl } from '../../../utils/image-utils';
import { LandingPageData, CourseData } from '../types';

interface UseLandingDataResult {
  landing: LandingPageData | null;
  course: CourseData | null;
  loading: boolean;
  error: boolean;
}

interface LandingCache {
  landing: LandingPageData;
  course: CourseData;
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
  const href = getOptimizedUrl(imageUrl, 500, 375);
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = href;
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
};

export function useLandingData(): UseLandingDataResult {
  const { slug } = useParams<{ slug: string }>();
  const { setActiveCourse } = useCourseContext();
  const [landing, setLanding] = useState<LandingPageData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasData = useRef(false);

  useEffect(() => {
    const fetchLandingData = async () => {
      if (!slug) return;

      const cached = readCache(slug);
      if (cached?.landing && cached?.course) {
        hasData.current = true;
        setLanding(cached.landing);
        setCourse(cached.course);
        setActiveCourse(cached.course as any);
        setLoading(false);
        preloadLcpImage(cached.course.imageUrl);
      }

      try {
        const landingRes = await getLandingPageBySlug(slug);
        if (landingRes.success && landingRes.data) {
          const landingData = landingRes.data as unknown as LandingPageData;

          const cachedCourse = cached?.course && cached.landing?.courseId === landingData.courseId
            ? cached.course
            : null;
          const courseRes = cachedCourse
            ? await getCourseById(landingData.courseId).catch(() => cachedCourse)
            : await getCourseById(landingData.courseId);
          const courseData = courseRes as unknown as CourseData;

          hasData.current = true;
          setLanding(landingData);
          setCourse(courseData);
          setActiveCourse(courseData as any);
          writeCache(slug, { landing: landingData, course: courseData });
          preloadLcpImage(courseData.imageUrl);

          trackCourseView(courseData.id, courseData.title, courseData.price);
        } else if (!hasData.current) {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
        if (!hasData.current) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, [slug, setActiveCourse]);

  return { landing, course, loading, error };
}

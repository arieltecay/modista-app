import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { getCourseById } from '../../services/courses';
import { trackCourseView } from '../../services/analytics';
import { CourseImage, InscriptionForm, Spinner, SEO } from '@/components';
import { formatTextToHtml } from '../../utils/textFormatting';
import { shouldShowInscription } from '../../utils/courseUtils';
import { useCourseContext } from '../../context/CourseContext';
import { getOptimizedUrl } from '../../utils/image-utils';

function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setActiveCourse } = useCourseContext();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const foundCourse = await getCourseById(id);
        setCourse(foundCourse);

        // Enviar evento de visualización del curso a GTM
        if (foundCourse) {
          trackCourseView(foundCourse.id, foundCourse.title, parseFloat(foundCourse.price?.toString() || '0'));
          setActiveCourse(foundCourse);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();

    return () => setActiveCourse(null);
  }, [id, setActiveCourse]);

  // 1. pricing_visible on mount if the course has a price > 0
  useEffect(() => {
    if (course?.price && Number(course.price) > 0) {
      import('../../utils/funnel-tracker').then(({ trackFunnel }) => {
        trackFunnel('pricing_visible', { courseId: course.id, courseTitle: course.title, value: Number(course.price) });
      });
    }
  }, [course?.id]);

  // 2. form_view: fire when the inscription form scrolls into view
  useEffect(() => {
    if (!course || !shouldShowInscription(course.price)) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        import('../../utils/funnel-tracker').then(({ trackFunnel }) => {
          trackFunnel('form_view', { courseId: course.id, courseTitle: course.title });
        });
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    const target = document.querySelector('[data-funnel-target="form"]') || document.body;
    observer.observe(target);
    return () => observer.disconnect();
  }, [course?.id]);

  // 3. Scroll depth
  useEffect(() => {
    if (!course) return;
    const fired = { 50: false, 90: false };
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      if (pct >= 50 && !fired[50]) { 
        fired[50] = true; 
        import('../../utils/funnel-tracker').then(({ trackFunnel }) => trackFunnel('scroll_50', { courseId: course.id, courseTitle: course.title })); 
      }
      if (pct >= 90 && !fired[90]) { 
        fired[90] = true; 
        import('../../utils/funnel-tracker').then(({ trackFunnel }) => trackFunnel('scroll_90', { courseId: course.id, courseTitle: course.title })); 
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [course?.id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner text="Cargando detalles del curso..." />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!course) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold">Curso no encontrado</h1>
        <p className="mt-4">
          <Link to="/cursos" className="text-blue-500 hover:underline">
            Volver a la lista de cursos
          </Link>
        </p>
      </div>
    );
  }

  // Lógica segura para obtener el ID del video de YouTube
  let youtubeVideoId = null;
  if (course.videoUrl && course.videoUrl.includes('youtube.com')) {
    try {
      const url = new URL(course.videoUrl);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        youtubeVideoId = videoId;
      }
    } catch (e) {
      console.error("Error al parsear la URL del video:", e);
    }
  }

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.shortDescription || course.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Modista App",
      "url": "https://modista-app.com"
    },
    "offers": {
      "@type": "Offer",
      "price": course.price,
      "priceCurrency": "ARS",
      "availability": "https://schema.org/InStock"
    },
    "image": getOptimizedUrl(course.imageUrl, 1200, 630)
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <SEO 
        title={course.title}
        description={course.shortDescription || course.description}
        ogImage={getOptimizedUrl(course.imageUrl, 1200, 630)}
        ogType="product"
        structuredData={courseStructuredData}
      />
      <div className="mb-4">
        <Link to="/cursos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          &larr; Volver a todos los cursos
        </Link>
      </div>
      <div className="bg-card shadow-lg rounded-lg overflow-hidden">
        <CourseImage 
          course={course} 
          className="w-full h-auto object-contain" 
          width={1200} 
          height={800} 
          priority={true} 
          crop="limit"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
          {/* Sección del Video */}
          {youtubeVideoId && (
            <div className="my-6 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <div
            className="text-foreground text-lg mt-4 text-justify"
            dangerouslySetInnerHTML={{ __html: formatTextToHtml(course.longDescription) }}
          />
        </div>
      </div>
      <div data-funnel-target="form">
        {shouldShowInscription(course.price) && <InscriptionForm course={course} />}
      </div>
    </div>
  );
}

export default CourseDetailPage;

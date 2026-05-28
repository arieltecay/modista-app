import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getLandingPageBySlug } from '../../services/landing';
import { getCourseById } from '../../services/courses';
import { LandingInscriptionForm, Spinner, SEO } from '@/components';
import { getOptimizedUrl } from '../../utils/image-utils';

const LandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [landing, setLanding] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLandingData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const landingRes = await getLandingPageBySlug(slug);
        if (landingRes.success && landingRes.data) {
          setLanding(landingRes.data);
          const courseData = await getCourseById(landingRes.data.courseId);
          setCourse(courseData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner text="Cargando oportunidad..." />
      </div>
    );
  }

  if (error || !landing) {
    return <Navigate to="/cursos" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <SEO 
        title={landing.customTitle || course?.title || 'Inscripción'}
        description={landing.customDescription || course?.shortDescription}
        ogImage={getOptimizedUrl(course?.imageUrl, 1200, 630)}
      />
      
      <div className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight uppercase">
          {landing.customTitle || course?.title}
        </h1>
        {(landing.customDescription || course?.shortDescription) && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {landing.customDescription || course?.shortDescription}
          </p>
        )}
      </div>

      <div className="w-full flex justify-center">
        <LandingInscriptionForm course={course} landingPage={landing} />
      </div>

      <div className="mt-16 text-gray-400 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Modista App. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CoursePurchaseSection from '../../components/CoursePurchaseSection';

function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const coursesData = await response.json();
        const foundCourse = coursesData.find(c => c.id === id);
        setCourse(foundCourse);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Cargando curso...</div>;
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
      // No se hace nada, youtubeVideoId permanece null y el video no se renderizará
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <Link to="/cursos" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          &larr; Volver a todos los cursos
        </Link>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={course.imageUrl} alt={`Imagen de ${course.title}`} className="w-full h-64 object-contain" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
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
          <p className="text-gray-700 text-lg mt-4 text-justify whitespace-pre-line">
            {course.longDescription}
          </p>
        </div>
        <CoursePurchaseSection course={course} />
      </div>
    </div>
  );
}

export default CourseDetailPage;

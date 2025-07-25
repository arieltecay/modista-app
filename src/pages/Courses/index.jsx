
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard'; // Importa el componente reutilizable
import { getCourses } from '../../services/api';

function CoursesPage({ limit }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        setCourses(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const coursesToShow = limit ? courses.slice(0, limit) : courses;
  const showMoreButton = limit && courses.length > limit;

  if (loading) {
    return <div className="text-center py-12">Cargando cursos...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
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
          {/*           <div className="mt-6 max-w-xl mx-auto text-left bg-purple-50 border border-purple-200 rounded p-4 text-sm text-purple-900">
            <b>¿Cómo probar pagos pendientes o rechazados?</b><br />
            <ul className="list-disc ml-5 mt-2">
              <li>Para simular un <b>pago pendiente</b> usa la tarjeta: <span className="font-mono">5031 7557 3453 0604</span></li>
              <li>Para simular un <b>pago rechazado</b> usa la tarjeta: <span className="font-mono">4000 0000 0000 0119</span></li>
              <li>Vencimiento: cualquier fecha futura</li>
              <li>CVV: 123</li>
            </ul>
            <span className="block mt-2">Puedes probarlo comprando cualquier curso y eligiendo la tarjeta correspondiente en el checkout de Mercado Pago.</span>
          </div> */}
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
              className="inline-block bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition-all duration-300"
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

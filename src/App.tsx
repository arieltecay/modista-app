import { lazy, Suspense } from 'react';
import GoogleTagManager from './components/GoogleTagManager';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Spinner } from '@/components';
import { Toaster } from 'react-hot-toast';

// Páginas Públicas
const HomePage = lazy(() => import('./pages/HomePage'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetailPage = lazy(() => import('./pages/Courses/CourseDetailPage'));
const TariffPage = lazy(() => import('./pages/Tariff'));
const PrivacyPolicyPage = lazy(() => import('./pages/privacy-policy'));
const TermsOfServicePage = lazy(() => import('./pages/terms-of-service'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <div className="bg-white">
      <GoogleTagManager />
      <Toaster />
      <main>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Spinner text="Cargando experiencia..." />
          </div>
        }>
          <Routes>
            {/* Rutas Públicas - Dentro del Layout principal */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="sobre-mi" element={<About />} />
              <Route path="cursos" element={<Courses />} />
              <Route path="cursos/:id" element={<CourseDetailPage />} />
              <Route path="tarifario" element={<TariffPage />} />
              <Route path="privacidad" element={<PrivacyPolicyPage />} />
              <Route path="terminos" element={<TermsOfServicePage />} />
            </Route>

            {/* Página 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

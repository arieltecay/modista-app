import { lazy, Suspense, useEffect } from 'react';
import GoogleTagManager from './components/GoogleTagManager';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Spinner, ScrollToTop } from '@/components';
import { Toaster } from 'react-hot-toast';
import { CourseProvider } from './context/CourseContext';
import { captureUTMParameters } from './utils/utm-tracking';
import LandingPage from './pages/LandingPage/LandingPage';

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
  useEffect(() => {
    captureUTMParameters();
  }, []);

  return (
    <CourseProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-250">
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

              {/* Landing Pages de Campaña - Sin Layout (minimalistas) */}
              <Route path="/lp/:slug" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Spinner text="Preparando tu lugar..." />
                  </div>
                }>
                  <LandingPage />
                </Suspense>
              } />

              {/* Página 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </CourseProvider>
  );
}

export default App;

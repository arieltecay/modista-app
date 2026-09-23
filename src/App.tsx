import { lazy, Suspense, useEffect } from 'react';
import GoogleTagManager from './components/GoogleTagManager';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Spinner, ScrollToTop } from '@/components';
import { Toaster } from 'react-hot-toast';
import { CourseProvider } from './context/CourseContext';
import { captureUTMParameters } from './utils/utm-tracking';
import LandingPage from './pages/LandingPage/LandingPage';

// Landing v2 "Atelier Digital" — ruta paralela bajo prueba (no reemplaza v1 todavía)
const LandingPageV2 = lazy(() => import('./pages/LandingV2'));
const HomeV2 = lazy(() => import('./pages/HomeV2'));
const CoursesV2 = lazy(() => import('./pages/CoursesV2'));
const CourseDetailV2 = lazy(() => import('./pages/CourseDetailV2'));
const TariffV2 = lazy(() => import('./pages/TariffV2'));
const AboutV2 = lazy(() => import('./pages/AboutV2'));

// Páginas Públicas
const HomePage = lazy(() => import('./pages/HomePage'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetailPage = lazy(() => import('./pages/Courses/CourseDetailPage'));
const TariffPage = lazy(() => import('./pages/Tariff'));
const PrivacyPolicyPage = lazy(() => import('./pages/privacy-policy'));
const TermsOfServicePage = lazy(() => import('./pages/terms-of-service'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

// Páginas de retorno de pago (MercadoPago)
const PaymentSuccess = lazy(() => import('./pages/Payment/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/Payment/PaymentFailure'));
const PaymentPending = lazy(() => import('./pages/Payment/PaymentPending'));

// Redirects de alias /v2/* → rutas canónicas (los params viajan intactos)
const CourseDetailRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/cursos/${id}`} replace />;
};
const LandingRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/lp/${slug}`} replace />;
};

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
              {/* ============================================================
                  CANÓNICAS — Sitio "Atelier Digital" (v2)
                  Estas son las rutas que ven los usuarios y las campañas.
                  Cada página v2 trae su propio V2Layout.
                  ============================================================ */}
              <Route path="/" element={
                <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
                  <HomeV2 />
                </Suspense>
              } />
              <Route path="/cursos" element={<Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}><CoursesV2 /></Suspense>} />
              <Route path="/cursos/:id" element={<Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}><CourseDetailV2 /></Suspense>} />
              <Route path="/tarifario" element={<Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}><TariffV2 /></Suspense>} />
              <Route path="/sobre-mi" element={<Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}><AboutV2 /></Suspense>} />

              {/* Landing Pages de Campaña (puerta de entrada de Meta Ads) */}
              <Route path="/lp/:slug" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
                    <Spinner text="Preparando tu lugar..." />
                  </div>
                }>
                  <LandingPageV2 />
                </Suspense>
              } />

              {/* ============================================================
                  LEGACY v1 — preservado bajo /v1/* para rollback inmediato.
                  NO borrar hasta pasado el período de gracia (ver
                  docs/REDISENO-V2-CLEANUP.md). Legal queda canónico acá
                  (contenido sin rediseño visual, a propósito).
                  ============================================================ */}
              <Route path="/v1" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="sobre-mi" element={<About />} />
                <Route path="cursos" element={<Courses />} />
                <Route path="cursos/:id" element={<CourseDetailPage />} />
                <Route path="tarifario" element={<TariffPage />} />
              </Route>

              <Route path="/v1/lp/:slug" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Spinner text="Preparando tu lugar..." />
                  </div>
                }>
                  <LandingPage />
                </Suspense>
              } />

              {/* Legal: contenido canónico con Layout v1 (sin rediseño) */}
              <Route path="/" element={<Layout />}>
                <Route path="privacidad" element={<PrivacyPolicyPage />} />
                <Route path="terminos" element={<TermsOfServicePage />} />
              </Route>

              {/* Alias /v2/* → canónicas (convivencia; las URLs viejas siguen
                  resolviendo durante el período de gracia). */}
              <Route path="/v2" element={<Navigate to="/" replace />} />
              <Route path="/v2/cursos" element={<Navigate to="/cursos" replace />} />
              <Route path="/v2/cursos/:id" element={<CourseDetailRedirect />} />
              <Route path="/v2/tarifario" element={<Navigate to="/tarifario" replace />} />
              <Route path="/v2/sobre-mi" element={<Navigate to="/sobre-mi" replace />} />
              <Route path="/v2/lp/:slug" element={<LandingRedirect />} />

              {/* Retorno de MercadoPago - sin Layout (UX dedicada) */}
              <Route path="/payment/success" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Spinner text="Verificando tu pago..." />
                  </div>
                }>
                  <PaymentSuccess />
                </Suspense>
              } />
              <Route path="/payment/failure" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Spinner />
                  </div>
                }>
                  <PaymentFailure />
                </Suspense>
              } />
              <Route path="/payment/pending" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Spinner />
                  </div>
                }>
                  <PaymentPending />
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

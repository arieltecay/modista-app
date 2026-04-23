import React, { lazy, Suspense } from 'react';
import GoogleTagManager from './components/GoogleTagManager';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute, Spinner } from '@/components';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

// Páginas Públicas
const HomePage = lazy(() => import('./pages/HomePage'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetailPage = lazy(() => import('./pages/Courses/CourseDetailPage'));
const TariffPage = lazy(() => import('./pages/Tariff'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));

// Panel de Administración (Bundle separado)
const AdminLayout = lazy(() => import('./components/AdminLayout/AdminLayout'));
const InscriptionsListPage = lazy(() => import('@/pages/admin/inscriptions/pages/InscriptionsListPage'));
const CourseListPage = lazy(() => import('@/pages/admin/courses/pages/CourseListPage'));
const CourseAddPage = lazy(() => import('@/pages/admin/courses/pages/CourseAddPage'));
const CourseEditPage = lazy(() => import('@/pages/admin/courses/pages/CourseEditPage'));
const CarouselManagerPage = lazy(() => import('@/pages/admin/carousel/CarouselManagerPage'));
const WorkshopSelectorPage = lazy(() => import('@/pages/admin/workshops/pages/WorkshopSelectorPage'));
const WorkshopInscriptionsPage = lazy(() => import('@/pages/admin/workshops/pages/WorkshopInscriptionsPage'));
const WorkshopSchedulePage = lazy(() => import('@/pages/admin/workshops/pages/WorkshopSchedulePage'));
const WorkshopAnalyticsPage = lazy(() => import('@/pages/admin/workshops/pages/WorkshopAnalyticsPage'));
const WorkshopMonthlyClosurePage = lazy(() => import('@/pages/admin/workshops/pages/WorkshopMonthlyClosurePage'));

function App() {
  return (
    <AuthProvider>
      <div className="bg-white">
        <GoogleTagManager />
        <Toaster />
        <Analytics />
        <SpeedInsights />
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
              </Route>

              {/* Rutas de Autenticación */}
              <Route path="/login" element={<LoginPage />} />

              {/* PANEL DE ADMINISTRACIÓN - Centralizado y Protegido por Roles */}
              <Route 
                path="/admin" 
                element={<ProtectedRoute allowedRoles={['admin']} />}
              >
                <Route element={<AdminLayout />}>
                  {/* Todas las subrutas de /admin heredan la validación automáticamente */}
                  <Route path="dashboard" element={<InscriptionsListPage />} />
                  
                  {/* Gestión de Cursos */}
                  <Route path="courses" element={<CourseListPage />} />
                  <Route path="courses/add" element={<CourseAddPage />} />
                  <Route path="courses/edit/:id" element={<CourseEditPage />} />

                  {/* Gestión de Carrusel */}
                  <Route path="carousel" element={<CarouselManagerPage />} />

                  {/* Gestión de Talleres Presenciales */}
                  <Route path="workshops" element={<WorkshopSelectorPage />} />
                  <Route path="workshops/:id" element={<WorkshopInscriptionsPage />} />
                  <Route path="workshops/:id/schedule" element={<WorkshopSchedulePage />} />
                  <Route path="workshops/more-info/:id" element={<WorkshopAnalyticsPage />} />
                  <Route path="workshops/closures/:id" element={<WorkshopMonthlyClosurePage />} />
                </Route>
              </Route>

              {/* Página 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
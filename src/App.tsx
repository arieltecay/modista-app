import GoogleTagManager from './components/GoogleTagManager';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetailPage from './pages/Courses/CourseDetailPage';
import { Routes, Route } from 'react-router-dom';
import NotFoundPage from './pages/NotFound';
import { Layout } from './components/Layout';

import InscriptionsListPage from './pages/admin/inscriptions/pages/InscriptionsListPage.tsx';
import CourseListPage from './pages/admin/courses/pages/CourseListPage';
import CourseAddPage from './pages/admin/courses/pages/CourseAddPage';
import CourseEditPage from './pages/admin/courses/pages/CourseEditPage';
import WorkshopSelectorPage from './pages/admin/workshops/pages/WorkshopSelectorPage';
import WorkshopInscriptionsPage from './pages/admin/workshops/pages/WorkshopInscriptionsPage';
import WorkshopSchedulePage from './pages/admin/workshops/pages/WorkshopSchedulePage';
import WorkshopAnalyticsPage from './pages/admin/workshops/pages/WorkshopAnalyticsPage';

import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <div className="bg-white">
      <GoogleTagManager />
      <Toaster />
      <Analytics />
      <SpeedInsights />
      <main>
        <Routes>
          {/* Layout base para el 90% de las rutas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="sobre-mi" element={<About />} />
            <Route path="cursos" element={<Courses />} />
            <Route path="cursos/:id" element={<CourseDetailPage />} />
          </Route>

          {/* Rutas de autenticación */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas de Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <InscriptionsListPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute requireAdmin={true}>
              <CourseListPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/add" element={
            <ProtectedRoute requireAdmin={true}>
              <CourseAddPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/edit/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <CourseEditPage />
            </ProtectedRoute>
          } />

          {/* Rutas de Gestión de Talleres Presenciales */}
          <Route path="/admin/workshops" element={
            <ProtectedRoute requireAdmin={true}>
              <WorkshopSelectorPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/workshops/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <WorkshopInscriptionsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/workshops/:id/schedule" element={
            <ProtectedRoute requireAdmin={true}>
              <WorkshopSchedulePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/workshops/more-info/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <WorkshopAnalyticsPage />
            </ProtectedRoute>
          } />

          {/* Página 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

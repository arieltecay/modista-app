import GoogleTagManager from './components/GoogleTagManager';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetailPage from './pages/Courses/CourseDetailPage';
import TariffPage from './pages/Tariff'; 
import { Routes, Route } from 'react-router-dom';
import NotFoundPage from './pages/NotFound';
import { Layout } from './components/Layout';

import InscriptionsListPage from '@/pages/admin/inscriptions/pages/InscriptionsListPage';
import CourseListPage from '@/pages/admin/courses/pages/CourseListPage';
import CourseAddPage from '@/pages/admin/courses/pages/CourseAddPage';
import CourseEditPage from '@/pages/admin/courses/pages/CourseEditPage';
import WorkshopSelectorPage from '@/pages/admin/workshops/pages/WorkshopSelectorPage';
import WorkshopInscriptionsPage from '@/pages/admin/workshops/pages/WorkshopInscriptionsPage';
import WorkshopSchedulePage from '@/pages/admin/workshops/pages/WorkshopSchedulePage';
import WorkshopAnalyticsPage from '@/pages/admin/workshops/pages/WorkshopAnalyticsPage';

import LoginPage from './pages/Auth/LoginPage';
import { ProtectedRoute } from '@/components';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <AuthProvider>
      <div className="bg-white">
        <GoogleTagManager />
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <main>
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
              {/* Todas las subrutas de /admin heredan la validación automáticamente */}
              <Route path="dashboard" element={<InscriptionsListPage />} />
              
              {/* Gestión de Cursos */}
              <Route path="courses" element={<CourseListPage />} />
              <Route path="courses/add" element={<CourseAddPage />} />
              <Route path="courses/edit/:id" element={<CourseEditPage />} />

              {/* Gestión de Talleres Presenciales */}
              <Route path="workshops" element={<WorkshopSelectorPage />} />
              <Route path="workshops/:id" element={<WorkshopInscriptionsPage />} />
              <Route path="workshops/:id/schedule" element={<WorkshopSchedulePage />} />
              <Route path="workshops/more-info/:id" element={<WorkshopAnalyticsPage />} />
            </Route>

            {/* Página 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
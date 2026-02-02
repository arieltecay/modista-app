
import GoogleTagManager from './components/GoogleTagManager/index.jsx';
import HomePage from './pages/HomePage';
import About from './pages/About/index.jsx';
import Courses from './pages/Courses/index.jsx';
import CourseDetailPage from './pages/Courses/CourseDetailPage.jsx';
import { Routes, Route } from 'react-router-dom';
import NotFoundPage from './pages/NotFound/index.jsx';
import { Layout } from './components/Layout/index.jsx';
import InscriptionsAdminPage from './pages/Admin/Inscriptions/index.jsx';
import CoursesAdminPage from './pages/Admin/Courses/index.jsx';
import AddCoursePage from './pages/Admin/Courses/AddCoursePage.jsx';
import EditCoursePage from './pages/Admin/Courses/EditCoursePage.jsx';
import AdminCoursePage from './pages/Admin/Courses/AdminCourseSelector.jsx';
import WorkshopDetailPage from './pages/Admin/Courses/WorkshopDetailPage.jsx';
import WorkshopSchedulePage from './pages/Admin/Courses/WorkshopSchedulePage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
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

          {/* Rutas sin el layout principal (como el admin) */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <InscriptionsAdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute requireAdmin={true}>
              <CoursesAdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/add" element={
            <ProtectedRoute requireAdmin={true}>
              <AddCoursePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/edit/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <EditCoursePage />
            </ProtectedRoute>
          } />

          {/* Nuevas rutas de Gestión de Talleres Presenciales */}
          <Route path="/admin/workshops" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminCoursePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/workshops/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <WorkshopDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/workshops/:id/schedule" element={
            <ProtectedRoute requireAdmin={true}>
              <WorkshopSchedulePage />
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

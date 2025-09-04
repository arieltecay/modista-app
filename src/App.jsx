
import GoogleTagManager from './components/GoogleTagManager/index.jsx';
import HomePage from './pages/HomePage';
import About from './pages/About/index.jsx';
import Courses from './pages/Courses/index.jsx';
import CourseDetailPage from './pages/Courses/CourseDetailPage.jsx';
import { Routes, Route } from 'react-router-dom';
import SuccessPage from './pages/PaymentStatus/SuccessPage';
import FailurePage from './pages/PaymentStatus/FailurePage';
import PendingPage from './pages/PaymentStatus/PendingPage';
import NotFoundPage from './pages/NotFound/index.jsx';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { Layout, WithPaymentLayout } from './components/Layout/index.jsx';
import InscriptionsAdminPage from './pages/Admin/Inscriptions/index.jsx';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

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

          {/* Layout para rutas de pago */}
          <Route path="/payment" element={<WithPaymentLayout />}>
            <Route path="success" element={<SuccessPage />} />
            <Route path="failure" element={<FailurePage />} />
            <Route path="pending" element={<PendingPage />} />
          </Route>

          {/* Rutas sin el layout principal (como el admin) */}
          <Route path="/admin/inscriptions" element={<InscriptionsAdminPage />} />

          {/* Página 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

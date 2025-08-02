
import Navbar from './components/Navbar/index.jsx';
import HomePage from './pages/HomePage';
import About from './pages/About/index.jsx';
import Courses from './pages/Courses/index.jsx';
import CourseDetailPage from './pages/Courses/CourseDetailPage.jsx';
import Footer from './pages/Footer/index.jsx';
import { Routes, Route } from 'react-router-dom';
import SuccessPage from './pages/PaymentStatus/SuccessPage';
import FailurePage from './pages/PaymentStatus/FailurePage';
import PendingPage from './pages/PaymentStatus/PendingPage';
import NotFoundPage from './pages/NotFound/index.jsx';
import { initMercadoPago } from '@mercadopago/sdk-react';

initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

function App() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/cursos/:id" element={<CourseDetailPage />} />
          <Route path="/sobre-mi" element={<About />} />
          <Route path="/contacto" element={<Footer />} />
          {/* Mercado Pago Routes */}
          <Route path="/payment/success" element={<SuccessPage />} />
          <Route path="/payment/failure" element={<FailurePage />} />
          <Route path="/payment/pending" element={<PendingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

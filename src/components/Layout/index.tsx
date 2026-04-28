import { Navbar, WhatsAppFloatingButton } from '@/components';
import Footer from '../../pages/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import FaqSection from '../FaqSection/FaqSection';

export const Layout = () => {
  const location = useLocation();
  // No mostrar en About (pedido por usuario) ni en Home/Cursos (ya lo incluyen internamente)
  const excludePaths = ['/sobre-mi', '/', '/cursos'];
  const showFaq = !excludePaths.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {showFaq && <FaqSection />}
      <WhatsAppFloatingButton />
      <Footer />
    </>
  );
};

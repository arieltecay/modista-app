import { Navbar, FloatingActionsContainer } from '@/components';
import Footer from '../../pages/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import FaqSection from '../FaqSection/FaqSection';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
  const location = useLocation();
  // No mostrar en About (pedido por usuario) ni en Home/Cursos (ya lo incluyen internamente)
  const excludePaths = ['/sobre-mi', '/', '/cursos'];
  const showFaq = !excludePaths.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {showFaq && <FaqSection />}
      <FloatingActionsContainer />
      <Footer />
    </>
  );
};

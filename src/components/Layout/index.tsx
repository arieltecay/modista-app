import { Navbar, WhatsAppFloatingButton } from '@/components';
import Footer from '../../pages/Footer';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <WhatsAppFloatingButton />
      <Footer />
    </>
  );
};

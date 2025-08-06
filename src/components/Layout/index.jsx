import Navbar from '../Navbar';
import Footer from '../../pages/Footer';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </>
  );
};

export const WithPaymentLayout = () => {
  // Layout específico para páginas de pago
  return <div className="bg-white"><Outlet /></div>;
};
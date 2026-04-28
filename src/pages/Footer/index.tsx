import React from 'react';
import { FaWhatsapp, FaEnvelope, FaInstagram, FaTiktok } from 'react-icons/fa';
import { whatsappNumber } from '../../utils/constants';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[var(--color-green-600)] text-black py-12">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Bienvenidos a ésta comunidad que cose sueños</h2>
        <h4 className="text-2xl font-bold mb-6">Conectá conmigo</h4>
        <p className="mb-8 text-lg">¿Quieres aprender más?, ¿Hacerme una pregunta o simplemente saludar? Estoy a un click de distancia</p>
        <div className="flex justify-center space-x-6 mb-8">
          <a href={whatsappNumber} target="_blank" rel="noopener noreferrer" className="text-4xl hover:text-[var(--color-green-600)] transition duration-300">
            <FaWhatsapp />
          </a>
          <a href="https://www.instagram.com/soymicaguevara" className="text-4xl hover:text-[var(--color-green-600)] transition duration-300"><FaInstagram /></a>
          <a href="https://www.tiktok.com/@soymicaguevara" className="text-4xl hover:text-[var(--color-green-600)] transition duration-300"><FaTiktok /></a>
        </div>
        <p className="text-gray-500 mb-4">&copy; 2025 Micaela Guevara Modista de alta costura. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <Link to="/privacidad" className="hover:underline">Política de Privacidad</Link>
          <span>|</span>
          <Link to="/terminos" className="hover:underline">Términos y Condiciones</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
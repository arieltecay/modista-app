import { FaWhatsapp, FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';
import { whatsappNumber } from '../../utils/constants';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Contacto ✂️</h2>
        <p className="mb-8 text-lg text-gray-400">¿Tienes alguna pregunta? ¡No dudes en contactarme!</p>
        <div className="flex justify-center space-x-6 mb-8">
          <a href={whatsappNumber} target="_blank" rel="noopener noreferrer" className="text-4xl hover:text-purple-400 transition duration-300">
            <FaWhatsapp />
          </a>
          <a href="mailto:hola@modista.com" className="text-4xl hover:text-purple-400 transition duration-300">
            <FaEnvelope />
          </a>
          <a href="#" className="text-4xl hover:text-purple-400 transition duration-300"><FaInstagram /></a>
          <a href="#" className="text-4xl hover:text-purple-400 transition duration-300"><FaFacebook /></a>
        </div>
        <p className="text-gray-500">&copy; 2025 ModistaApp. Todos los derechos reservados. 👗</p>
      </div>
    </footer>
  );
};

export default Footer;
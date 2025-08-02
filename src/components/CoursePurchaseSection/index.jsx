import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import PaymentButton from '../PaymentButton';

const CoursePurchaseSection = ({ course }) => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">¡Inscríbete ahora!</h2>
          <p className="text-gray-600 text-lg mb-8 text-center">
            Aprovecha esta oportunidad para aprender y crecer. El curso incluye:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg mb-8 space-y-2">
            <li>Acceso a todas las clases grabadas</li>
            <li>Material de apoyo descargable</li>
            <li>Certificado de finalización</li>
            <li>Acceso a comunidad exclusiva</li>
          </ul>
          <div className="flex flex-col items-center space-y-4">
            <PaymentButton course={course} />
            <a
              href="https://wa.me/3813508796"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition duration-300 shadow-lg"
            >
              <FaWhatsapp className="mr-2" /> Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursePurchaseSection;

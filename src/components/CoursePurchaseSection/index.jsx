import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Wallet } from '@mercadopago/sdk-react';
import { createPreference } from '../../services/api';

const CoursePurchaseSection = ({ course }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePreference = async () => {
    setIsLoading(true);
    try {
      const data = await createPreference(course, course.id);
      setPreferenceId(data.preferenceId);
    } catch (error) {
      console.error("Error creating preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            {!preferenceId && (
              isLoading ? (
                <div className="flex items-center justify-center bg-purple-600 text-white px-8 py-3 rounded-lg text-xl font-semibold shadow-lg">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando medio de pago
                </div>
              ) : (
                <button
                  onClick={handleCreatePreference}
                  className="bg-[var(--color-green-600)] text-white px-8 py-3 rounded-lg text-xl font-semibold hover:brightness-95 transition duration-300 shadow-lg"
                >
                  Comprar Curso
                </button>
              )
            )}
            {preferenceId && (
              <Wallet initialization={{ preferenceId: preferenceId }} />
            )}
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailTestPage from '../EmailTest';
import axios from 'axios';

// Pequeño componente para el Modal
const ConfirmationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">¡Éxito!</h2>
        <p className="mb-6">Tu correo de confirmación ha sido enviado correctamente.</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

const SuccessPage = () => {
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/data`, {
          withCredentials: true, // ¡Importante! Envía las cookies al backend
        });
        setCourseData(response.data);
      } catch (err) {
        setError('No se pudieron verificar los datos del pago. Por favor, contacta a soporte.');
        // Opcional: redirigir a la página de fallo después de un tiempo
        setTimeout(() => navigate('/payment/failure'), 5000);
      }
      setIsLoading(false);
    };

    fetchPaymentData();
  }, [navigate]);

  const handleEmailSent = () => {
    setIsModalOpen(true);
  };

  const closeModalAndRedirect = () => {
    setIsModalOpen(false);
    setCourseData(null); // Limpiar datos sensibles del estado
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        <p className="mt-4 text-xl text-gray-700">Verificando tu pago, por favor espera...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center p-4">
        <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-red-900 mt-4">¡Error en la Verificación!</h1>
        <p className="text-red-700 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-lg shadow-lg max-w-screen-lg w-full flex flex-col md:flex-row md:space-x-8">
          <div className="flex-1 flex flex-col items-center text-center">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">¡Pago verificado con éxito!</h1>
            <p className="text-gray-600 mt-2">
              Gracias por tu compra. Completa el siguiente formulario para recibir la confirmación.
            </p>
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            {courseData && <EmailTestPage courseData={courseData} onEmailSent={handleEmailSent} />}
          </div>
        </div>
      </div>
      <ConfirmationModal isOpen={isModalOpen} onClose={closeModalAndRedirect} />
    </>
  );
};

export default SuccessPage;
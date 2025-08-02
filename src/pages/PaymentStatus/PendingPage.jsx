import React from 'react';
import { Link } from 'react-router-dom';

const PendingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-lg shadow-lg max-w-md w-full">
        <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Pago pendiente</h1>
        <p className="text-gray-600 mt-2">
          Tu pago está siendo procesado. Te notificaremos por email una vez que se apruebe.<br />
          <span className="font-semibold">Para probar este estado usa la siguiente tarjeta de prueba:</span><br />
          <span className="block mt-2 text-sm text-yellow-700 bg-yellow-100 rounded p-2">
            Número: <b>5031 7557 3453 0604</b><br />
            Vencimiento: cualquier fecha futura<br />
            CVV: 123
          </span>
        </p>
        <div className="mt-8">
          <Link
            to="/cursos"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-green-600)] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-green-600)]"
          >
            Volver a cursos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingPage;
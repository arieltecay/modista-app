import React from 'react';
import { Link } from 'react-router-dom';

const FailurePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-lg shadow-lg max-w-md w-full">
        <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Pago rechazado</h1>
        <p className="text-gray-600 mt-2">
          Desafortunadamente no pudimos procesar el pago de tu compra. Por favor, intenta nuevamente.<br />
          <span className="font-semibold">Para probar este estado usa la siguiente tarjeta de prueba:</span><br />
          <span className="block mt-2 text-sm text-red-700 bg-red-100 rounded p-2">
            Número: <b>4000 0000 0000 0119</b><br />
            Vencimiento: cualquier fecha futura<br />
            CVV: 123
          </span>
        </p>
        <div className="mt-8">
          <Link
            to="/cursos"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Intenta nuevamente
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FailurePage;

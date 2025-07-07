import React from 'react';
import { Link, useLocation } from 'react-router-dom';


// Helper to parse query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SuccessPage = () => {
  const query = useQuery();
  const paymentId = query.get('payment_id');
  const status = query.get('status');
  const merchantOrderId = query.get('merchant_order_id');
  const preferenceId = query.get('preference_id');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-lg shadow-lg max-w-md w-full">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">¡Pago exitoso!</h1>
        <p className="text-gray-600 mt-2">
          Gracias por tu compra. Te contactaremos para coordinar la validación.
        </p>
        <div className="mt-6 text-left text-sm text-gray-700">
          <div><span className="font-semibold">ID de pago:</span> {paymentId || 'No disponible'}</div>
          <div><span className="font-semibold">Estado:</span> {status || 'No disponible'}</div>
          <div><span className="font-semibold">Orden:</span> {merchantOrderId || 'No disponible'}</div>
          <div><span className="font-semibold">Preferencia:</span> {preferenceId || 'No disponible'}</div>
        </div>
        <div className="mt-8">
          <Link
            to="/cursos"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Ir a mis cursos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

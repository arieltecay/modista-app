import React, { useState } from 'react';
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react';
import { createPreference } from '../../services/api';

initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);

const PaymentButton = ({ course }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);

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
    <div className="flex justify-center mt-4">
      {!preferenceId ? (
        isLoading ? (
          <div className="flex items-center justify-center bg-[var(--color-green-600)] text-white px-8 py-3 rounded-lg text-xl font-semibold shadow-lg">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando medio de pago
          </div>
        ) : (
          <button
            onClick={handleCreatePreference}
            className="bg-[var(--color-green-600)] text-gray-500 px-8 py-3 rounded-lg text-xl font-semibold hover:brightness-95 transition duration-300 shadow-lg"
          >
            Inscribirme ahora
          </button>
        )
      ) : (
        <Wallet initialization={{ preferenceId: preferenceId }} />
      )}
    </div>
  );
};

export default PaymentButton;

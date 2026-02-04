import React, { useState } from 'react';
import toast from 'react-hot-toast';

const DepositModal = ({ isOpen, onClose, onSubmit, inscription, isSubmitting }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Por favor, ingresa un monto válido mayor a 0');
      return;
    }
    if (numAmount >= inscription.coursePrice) {
      toast.error(`La seña debe ser menor al total del curso ($${inscription.coursePrice})`);
      return;
    }
    onSubmit(inscription._id, numAmount);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black/60 opacity-100 transition-opacity z-0"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-indigo-100 relative z-10">
          <form onSubmit={handleSubmit}>
            <div className="!bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-xl leading-6 font-bold !text-gray-900" id="modal-title">
                    Registrar Seña
                  </h3>
                  <div className="mt-2 text-sm space-y-3">
                    <p className="!text-gray-600 font-medium">
                      Ingresa el monto de la seña para <span className="font-bold !text-indigo-600">{inscription.nombre} {inscription.apellido}</span>.
                    </p>
                    <div className="!bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                      <p className="!text-indigo-900 font-medium text-sm">Taller: <span className="!text-indigo-700">{inscription.courseTitle}</span></p>
                      <p className="!text-indigo-900 font-bold text-lg mt-1">Total: <span className="!text-gray-900">${inscription.coursePrice}</span></p>
                    </div>

                    <div className="!bg-red-50 !border-l-4 !border-red-500 !p-4 rounded-r-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs !text-red-700 font-bold leading-tight">
                            ⚠️ IMPORTANTE: Al registrar la seña se reservará automáticamente un cupo. El monto NO es reembolsable.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="amount" className="block text-sm font-bold !text-gray-700 mb-2">
                        Monto de la Seña
                      </label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="!text-gray-500 font-bold sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="amount"
                          id="amount"
                          className="!bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 text-lg font-bold border-2 border-gray-200 rounded-xl h-12 outline-none px-4 !text-gray-900 shadow-inner"
                          placeholder="0.00"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          autoFocus
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="!bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-6 py-3 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all active:scale-95 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar y Enviar Mail'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-xl border-2 border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-bold !text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;

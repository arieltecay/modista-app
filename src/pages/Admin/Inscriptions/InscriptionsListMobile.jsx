import React from 'react';
import Spinner from '../../../components/Spinner';

const InscriptionsListMobile = ({
  inscriptions,
  loading,
  handlePaymentStatusUpdate,
  handleSendCourseEmail,
  showDepositFeature = false,
  onDepositClick
}) => {
  if (loading) {
    return <div className="flex justify-center items-center p-10"><Spinner /></div>;
  }

  return (
    <div className="md:hidden">
      {inscriptions.map((inscription) => (
        <div key={inscription._id} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-gray-900 whitespace-normal">{inscription.nombre} {inscription.apellido}</p>
            <span className="text-xs text-gray-600 whitespace-nowrap">{new Date(inscription.fechaInscripcion).toLocaleDateString('es-AR')}</span>
          </div>
          <p className="text-sm text-gray-700 break-all">{inscription.email}</p>
          <p className="text-sm text-gray-700">{inscription.celular}</p>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">{inscription.courseTitle || 'N/A'}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-green-600 font-bold">${inscription.coursePrice || 0}</p>
                {showDepositFeature && inscription.depositAmount > 0 && (
                  <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100 font-bold">
                    Seña: ${inscription.depositAmount}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2 py-1 text-xs rounded-full border ${inscription.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                {inscription.paymentStatus === 'paid' ? '✅ Pagado' : '⏳ Pendiente'}
              </span>
              {inscription.paymentStatus === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePaymentStatusUpdate(inscription._id, 'paid')}
                    className="bg-green-500 text-white px-3 py-1 text-xs rounded hover:bg-green-600 transition-colors"
                    disabled={loading}
                  >
                    {loading ? '...' : 'Pagado'}
                  </button>
                  {showDepositFeature && !inscription.depositAmount && (
                    <button
                      onClick={() => onDepositClick(inscription)}
                      className="bg-indigo-500 text-white px-3 py-1 text-xs rounded hover:bg-indigo-600 transition-colors"
                      disabled={loading}
                    >
                      Seña
                    </button>
                  )}
                </div>
              )}
              {inscription.paymentStatus === 'paid' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePaymentStatusUpdate(inscription._id, 'pending')}
                    className="bg-gray-500 text-white px-2 py-1 text-xs rounded hover:bg-gray-600 transition-colors"
                    disabled={loading}
                  >
                    Revertir
                  </button>
                  <button
                    onClick={() => handleSendCourseEmail(inscription)}
                    className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InscriptionsListMobile;

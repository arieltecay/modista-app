import type { FC } from 'react';
import React from 'react';
import Spinner from '../../../../components/Spinner';

interface Turno {
  _id: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo: number;
  cuposInscriptos: number;
  courseId: string;
}

interface Inscription {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  paymentStatus: 'paid' | 'pending';
  coursePrice: number;
  depositAmount: number;
  depositDate?: string;
  isReserved: boolean;
  fechaInscripcion: string;
  turnoId: Turno | string;
}

interface WorkshopInscriptionsListProps {
  inscriptions: Inscription[];
  loading: boolean;
  handlePaymentStatusUpdate: (inscriptionId: string, newStatus: 'paid' | 'pending') => Promise<void>;
  onDepositClick: (inscription: Inscription) => void;
}

const WorkshopInscriptionsList: FC<WorkshopInscriptionsListProps> = ({
  inscriptions,
  loading,
  handlePaymentStatusUpdate,
  onDepositClick
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12 bg-white rounded-xl shadow-sm">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {inscriptions.map((inscription: Inscription) => (
        <div key={inscription._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {inscription.nombre} {inscription.apellido}
              </h3>
              {inscription.turnoId && typeof inscription.turnoId === 'object' && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {inscription.turnoId.diaSemana} - {inscription.turnoId.horaInicio} hs
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${inscription.paymentStatus === 'paid'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                {inscription.paymentStatus === 'paid' ? 'PAGADO' : 'PENDIENTE'}
              </span>
              <p className="text-[10px] text-gray-400 mt-1">
                {new Date(inscription.fechaInscripcion).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Contacto</p>
              <p className="text-xs text-gray-700 mt-0.5 break-all">{inscription.email}</p>
              <p className="text-xs text-gray-500">{inscription.celular}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Finanzas</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">Total: ${inscription.coursePrice || 0}</p>
              {inscription.depositAmount > 0 ? (
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Seña: ${inscription.depositAmount}</p>
              ) : (
                <p className="text-[10px] text-gray-300 italic mt-0.5">Sin seña</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {inscription.paymentStatus === 'pending' ? (
              <>
                <button
                  onClick={() => handlePaymentStatusUpdate(inscription._id, 'paid')}
                  className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-emerald-200 active:scale-95 transition-all"
                  disabled={loading}
                >
                  Confirmar Pago
                </button>
                <button
                  onClick={() => onDepositClick(inscription)}
                  className="flex-1 bg-indigo-50 text-indigo-700 border border-indigo-100 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all"
                  disabled={loading}
                >
                  {inscription.depositAmount ? 'Modificar Seña' : 'Registrar Seña'}
                </button>
              </>
            ) : (
              <button
                onClick={() => handlePaymentStatusUpdate(inscription._id, 'pending')}
                className="flex-1 bg-gray-50 text-gray-500 border border-gray-200 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all"
                disabled={loading}
              >
                Revertir a Pendiente
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkshopInscriptionsList;

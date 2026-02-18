import type { FC } from 'react';
import React from 'react';
import { Spinner } from '@/components';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

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

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface SortableHeaderProps {
  children: React.ReactNode;
  name: string;
  sortConfig: SortConfig;
  onSort: (name: string) => void;
}

const SortableHeader: FC<SortableHeaderProps> = ({ children, name, sortConfig, onSort }) => {
  const isSorted = sortConfig.key === name;
  const direction = isSorted ? sortConfig.direction : undefined;

  const getIcon = () => {
    if (!isSorted) return <FaSort className="inline ml-1 text-gray-300" />;
    if (direction === 'asc') return <FaSortUp className="inline ml-1 text-indigo-500" />;
    return <FaSortDown className="inline ml-1 text-indigo-500" />;
  };

  return (
    <th
      className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onSort(name)}
    >
      <div className="flex items-center">
        {children}
        {getIcon()}
      </div>
    </th>
  );
};

interface WorkshopInscriptionsTableProps {
  inscriptions: Inscription[];
  loading: boolean;
  handlePaymentStatusUpdate: (inscriptionId: string, newStatus: 'paid' | 'pending') => Promise<void>;
  sortConfig: SortConfig;
  handleSort: (key: string) => void;
  onDepositClick: (inscription: Inscription) => void;
}

const WorkshopInscriptionsTable: FC<WorkshopInscriptionsTableProps> = ({
  inscriptions,
  loading,
  handlePaymentStatusUpdate,
  sortConfig,
  handleSort,
  onDepositClick
}) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-20 bg-white">
        <Spinner />
        <p className="mt-4 text-gray-400 animate-pulse">Cargando inscriptos...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto hidden md:block">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <SortableHeader name="nombre" sortConfig={sortConfig} onSort={handleSort}>Nombre</SortableHeader>
            <SortableHeader name="email" sortConfig={sortConfig} onSort={handleSort}>Email / Celular</SortableHeader>
            <SortableHeader name="turnoId" sortConfig={sortConfig} onSort={handleSort}>Horario</SortableHeader>
            <SortableHeader name="coursePrice" sortConfig={sortConfig} onSort={handleSort}>Precio</SortableHeader>
            <SortableHeader name="depositAmount" sortConfig={sortConfig} onSort={handleSort}>Seña</SortableHeader>
            <SortableHeader name="paymentStatus" sortConfig={sortConfig} onSort={handleSort}>Estado Pago</SortableHeader>
            <th className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
            <SortableHeader name="fechaInscripcion" sortConfig={sortConfig} onSort={handleSort}>Inscripción</SortableHeader>
          </tr>
        </thead>
        <tbody className="bg-white">
          {inscriptions.map((inscription) => (
            <tr key={inscription._id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-4 border-b border-gray-100 text-sm">
                <p className="text-gray-900 font-semibold">{inscription.nombre} {inscription.apellido}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-100 text-sm">
                <p className="text-gray-700">{inscription.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">{inscription.celular}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-100 text-sm">
                {inscription.turnoId && typeof inscription.turnoId === 'object' ? (
                  <div className="flex flex-col">
                    <span className="text-xs text-indigo-600 font-bold bg-indigo-50 inline-block px-2 py-1 rounded-md text-center">
                      {inscription.turnoId.diaSemana}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 text-center">
                      {inscription.turnoId.horaInicio} hs
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-300 italic">No asignado</span>
                )}
              </td>
              <td className="px-5 py-4 border-b border-gray-100 text-sm">
                <p className="text-gray-900 font-medium">${inscription.coursePrice || 0}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-100 text-sm">
                {inscription.depositAmount > 0 ? (
                  <div className="flex flex-col items-center">
                    <span className="text-emerald-600 font-bold text-base">${inscription.depositAmount}</span>
                    <span className="text-[10px] text-gray-400">
                      {inscription.depositDate ? new Date(inscription.depositDate).toLocaleDateString() : 'Registrado'}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-300 italic">Sin seña</span>
                )}
              </td>
              <td className="px-5 py-4 border-b border-gray-100 text-sm text-center">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${inscription.paymentStatus === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                  {inscription.paymentStatus === 'paid' ? '✅ Pagado' : '⏳ Pendiente'}
                </span>
              </td>
              <td className="px-5 py-4 border-b border-gray-100 text-sm">
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                  {inscription.paymentStatus === 'pending' ? (
                    <>
                      <button
                        onClick={() => handlePaymentStatusUpdate(inscription._id, 'paid')}
                        className="w-full bg-emerald-500 text-white px-3 py-1.5 text-xs rounded-lg font-bold hover:bg-emerald-600 shadow-sm transition-all active:scale-95"
                        disabled={loading}
                      >
                        Completar Pago
                      </button>
                      <button
                        onClick={() => onDepositClick(inscription)}
                        className="w-full bg-white text-indigo-600 border border-indigo-200 px-3 py-1.5 text-xs rounded-lg font-bold hover:bg-indigo-50 transition-all active:scale-95"
                        disabled={loading}
                      >
                        {inscription.depositAmount ? 'Modificar Seña' : 'Cargar Seña'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handlePaymentStatusUpdate(inscription._id, 'pending')}
                      className="w-full bg-white text-gray-500 border border-gray-200 px-3 py-1.5 text-xs rounded-lg font-bold hover:bg-gray-50 transition-all active:scale-95"
                      disabled={loading}
                    >
                      Revertir a Pendiente
                    </button>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 border-b border-gray-100 text-sm text-right">
                <p className="text-gray-500 text-xs">
                  {new Date(inscription.fechaInscripcion).toLocaleDateString('es-AR')}
                </p>
                <p className="text-[10px] text-gray-300">
                  {new Date(inscription.fechaInscripcion).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkshopInscriptionsTable;

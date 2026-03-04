import React from 'react';
import { Spinner } from '@/components';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { SortableHeaderProps, InscriptionsTableDesktopProps, TurnoData } from './types';

const SortableHeader: React.FC<SortableHeaderProps> = ({ children, name, sortConfig, onSort }) => {
  const isSorted = sortConfig.key === name;
  const direction = isSorted ? sortConfig.direction : undefined;

  const getIcon = () => {
    if (!isSorted) return <FaSort className="inline ml-1" />;
    if (direction === 'asc') return <FaSortUp className="inline ml-1" />;
    return <FaSortDown className="inline ml-1" />;
  };

  return (
    <th
      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
      onClick={() => onSort(name)}
    >
      {children}
      {getIcon()}
    </th>
  );
};

const InscriptionsTableDesktop: React.FC<InscriptionsTableDesktopProps> = ({
  inscriptions,
  loading,
  handlePaymentStatusUpdate,
  sortConfig,
  handleSort,
  handleSendCourseEmail,
  showDepositFeature = false,
  onDepositClick,
  onWaReminderClick,
  hideCourseTitle = false
}) => {
  if (loading) {
    return <div className="flex justify-center items-center p-10"><Spinner /></div>;
  }

  return (
    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto hidden md:block">
      <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <SortableHeader name="nombre" sortConfig={sortConfig} onSort={handleSort}>Nombre Completo</SortableHeader>
              <SortableHeader name="email" sortConfig={sortConfig} onSort={handleSort}>Email</SortableHeader>
              <SortableHeader name="celular" sortConfig={sortConfig} onSort={handleSort}>Celular</SortableHeader>
              {!hideCourseTitle && <SortableHeader name="courseTitle" sortConfig={sortConfig} onSort={handleSort}>Taller</SortableHeader>}
              <SortableHeader name="horario" sortConfig={sortConfig} onSort={handleSort}>Horario</SortableHeader>
              <SortableHeader name="coursePrice" sortConfig={sortConfig} onSort={handleSort}>Precio</SortableHeader>
              {showDepositFeature && <SortableHeader name="depositAmount" sortConfig={sortConfig} onSort={handleSort}>Seña</SortableHeader>}
              <SortableHeader name="paymentStatus" sortConfig={sortConfig} onSort={handleSort}>Estado Pago</SortableHeader>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">WhatsApp</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              <SortableHeader name="fechaInscripcion" sortConfig={sortConfig} onSort={handleSort}>Fecha de Inscripción</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {inscriptions.map((inscription) => (
              <tr key={inscription._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{inscription.nombre} {inscription.apellido}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{inscription.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{inscription.celular}</p>
                </td>
                {!hideCourseTitle && (
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 font-medium">{inscription.courseTitle || 'N/A'}</p>
                  </td>
                )}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {inscription.turnoId && typeof inscription.turnoId === 'object' ? (
                    <p className="text-xs text-indigo-600 font-bold bg-indigo-50 inline-block px-1.5 py-0.5 rounded">
                      {(inscription.turnoId as TurnoData).diaSemana} - {(inscription.turnoId as TurnoData).horaInicio} hs
                    </p>
                  ) : (
                    <span className="text-gray-400 italic">No asignado</span>
                  )}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">${inscription.coursePrice || 0}</p>
                </td>
                {showDepositFeature && (
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {inscription.depositAmount && inscription.depositAmount > 0 ? (
                      <div>
                        <p className="text-green-600 font-bold whitespace-no-wrap">${inscription.depositAmount}</p>
                        <p className="text-[10px] text-gray-400">
                          {inscription.depositDate ? new Date(inscription.depositDate).toLocaleDateString() : ''}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-300 italic">Sin seña</span>
                    )}
                  </td>
                )}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full border ${inscription.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                    {inscription.paymentStatus === 'paid' ? '✅ Pagado' : '⏳ Pendiente'}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <button
                    onClick={() => onWaReminderClick(inscription._id)}
                    className={`p-2 rounded-full transition-all duration-300 relative group ${
                      (inscription as any).waMessagesSent >= 3 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white border border-green-200'
                    }`}
                    title={(inscription as any).waMessagesSent >= 3 ? 'Límite de mensajes alcanzado' : 'Enviar recordatorio WhatsApp'}
                    disabled={loading || (inscription as any).waMessagesSent >= 3}
                  >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-93.3-25.7l-6.7-4.1-69.5 18.3L72.7 359l-4.5-7.1c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.5-8.6-44.8-27.3-16.6-14.8-27.8-33.1-31-38.7-3.3-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.6-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {(inscription as any).waMessagesSent || 0}
                    </span>
                  </button>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center gap-2">
                    {inscription.paymentStatus === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePaymentStatusUpdate(inscription._id, 'paid')}
                          className="bg-green-500 text-white px-3 py-1 text-xs rounded hover:bg-green-600 transition-colors"
                          disabled={loading}
                        >
                          {loading ? '...' : 'Marcar Pagado'}
                        </button>
                        {showDepositFeature && !(inscription.depositAmount && inscription.depositAmount > 0) && (
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
                      <div className="flex gap-1">
                        <button
                          onClick={() => handlePaymentStatusUpdate(inscription._id, 'pending')}
                          className="bg-gray-500 text-white px-2 py-1 text-xs rounded hover:bg-gray-600 transition-colors"
                          disabled={loading}
                        >
                          Revertir
                        </button>
                        <button
                          onClick={() => handleSendCourseEmail(inscription)}
                          className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition-colors"
                          disabled={loading}
                        >
                          {loading ? '...' : 'Enviar Video'}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Date(inscription.fechaInscripcion).toLocaleDateString('es-AR')}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InscriptionsTableDesktop;

import { useEffect, useState, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getWorkshopDetails } from '../../../../services/inscriptions/workshopInscriptionService';
import { WorkshopDetailsResponse, WorkshopInscriptionItem } from '../../../../services/inscriptions/types';
import { Spinner } from '@/components';
import ScheduleUpdateModal from '@/components/ScheduleUpdateModal';

// Type for the inscription object passed to the modal
interface ModalInscription {
  _id: string;
  nombre: string;
  apellido: string;
  turnoId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
}

const WorkshopAnalyticsPage: FC = () => {
  const { id: workshopId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<WorkshopDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInscriptionForModal, setSelectedInscriptionForModal] = useState<ModalInscription | null>(null);

  useEffect(() => {
    if (!workshopId) {
      toast.error('No se ha especificado un ID de workshop.');
      navigate('/admin/workshops');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch workshop details
        const response = await getWorkshopDetails(workshopId);
        setData(response);
      } catch {
        setError('Error al cargar los detalles. Por favor, intenta de nuevo.');
        toast.error('Error al cargar los detalles del workshop.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workshopId, navigate]);

  const openModal = (inscription: ModalInscription) => {
    setSelectedInscriptionForModal(inscription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInscriptionForModal(null);
    // Optionally refetch data after modal close if an update occurred
    // fetchData(); // Re-fetch data to reflect changes
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (error || !data) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  const { workshopTitle, summary, turnoGroups } = data;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{workshopTitle}</h1>
        <p className="text-gray-500">Análisis de inscriptos y pagos.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Pago Total</h2>
          <p className="text-4xl font-bold text-blue-600">{summary.totalPaidCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Cantidad de Pago de Seña</h2>
          <p className="text-4xl font-bold text-green-600">{summary.depositPaidCount}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Turnos Programados</h2>
        {turnoGroups.length > 0 ? (
          turnoGroups.map((group) => (
            <div key={group.turnoId} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {group.turnoLabel} ({group.enrolled}/{group.capacity})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Estado del Pago</th>
                      <th className="p-3 text-right">Monto Pagado</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.inscriptions.map((insc: WorkshopInscriptionItem) => {
                      const isFullPayment = insc.isFullPayment;
                      return (
                        <tr key={insc._id} className="border-b">
                          <td className="p-3 capitalize">{`${insc.nombre} ${insc.apellido}`}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isFullPayment
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                              }`}>
                              {isFullPayment ? 'Pago Total' : 'Seña'}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono">
                            ${insc.depositAmount.toLocaleString('es-AR')}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => openModal({
                                _id: insc._id,
                                nombre: insc.nombre,
                                apellido: insc.apellido,
                                turnoId: group.turnoId,
                                courseId: workshopId!, // Assert non-null as we check it on mount
                                courseTitle: data.workshopTitle,
                                coursePrice: data.workshopPrice
                              })}
                              className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
                              title="Reagendar horario"
                            >
                              <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m0-3l-8-8-7 7 7 7" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No hay inscriptos para este workshop.</p>
          </div>
        )}
      </div>

      <ScheduleUpdateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        inscription={selectedInscriptionForModal!} // Non-null assertion as it's only opened when selected
        courseId={workshopId!}
        workshopTitle={data.workshopTitle}
      />
    </div>
  );
};

export default WorkshopAnalyticsPage;

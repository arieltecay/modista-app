import { useEffect, useState, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getWorkshopDetails, deleteWorkshopInscription } from '../../../../services/inscriptions/workshopInscriptionService';
import { WorkshopDetailsResponse, WorkshopInscriptionItem } from '../../../../services/inscriptions/types';
import { Spinner } from '@/components';
import ConfirmDeleteModal from '@/pages/admin/shared/components/ConfirmDeleteModal';
import PaymentHistoryModal from '@/pages/admin/shared/components/PaymentHistoryModal';

// Tipos para los modales
interface HistoryModalInscription {
  inscriptionId: string;
  studentName: string;
  coursePrice: number;
}

const WorkshopAnalyticsPage: FC = () => {
  const { id: workshopId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<WorkshopDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedForHistory, setSelectedForHistory] = useState<HistoryModalInscription | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, inscriptionId: '', studentName: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    if (!workshopId) {
      toast.error('No se ha especificado un ID de workshop.');
      navigate('/admin/workshops');
      return;
    }
    try {
      setLoading(true);
      const response = await getWorkshopDetails(workshopId);
      setData(response);
    } catch {
      setError('Error al cargar los detalles. Por favor, intenta de nuevo.');
      toast.error('Error al cargar los detalles del workshop.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [workshopId, navigate]);

  // --- Handlers para Modales ---
  
  const openHistoryModal = (inscription: HistoryModalInscription) => {
    setSelectedForHistory(inscription);
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setSelectedForHistory(null);
    fetchData();
  };

  const handleDelete = (inscriptionId: string, studentName: string) => {
    setDeleteModal({ isOpen: true, inscriptionId, studentName });
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteWorkshopInscription(deleteModal.inscriptionId);
      toast.success('Alumno eliminado correctamente.');
      await fetchData();
    } catch (err) {
      toast.error('No se pudo eliminar al alumno. Por favor, intenta de nuevo.');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, inscriptionId: '', studentName: '' });
    }
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
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{workshopTitle}</h1>
        <p className="text-gray-500">Análisis de inscriptos y pagos.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Pagos Totales</h2>
          <p className="text-4xl font-bold text-blue-600">{summary.totalPaidCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Pagos Parciales</h2>
          <p className="text-4xl font-bold text-green-600">{summary.partialPaidCount}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Turnos Programados</h2>
        {turnoGroups.length > 0 ? (
          turnoGroups.map((group) => (
            <div key={group.turnoId} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{group.turnoLabel} ({group.enrolled}/{group.capacity})</h3>
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
                    {group.inscriptions.map((insc: WorkshopInscriptionItem) => (
                      <tr key={insc._id} className="border-b">
                        <td className="p-3 capitalize">{`${insc.nombre} ${insc.apellido}`}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${insc.isFullPayment ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {insc.isFullPayment ? 'Pago Total' : 'Pago Parcial'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">
                          ${(insc.totalPaid || 0).toLocaleString('es-AR')}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openHistoryModal({ inscriptionId: insc._id, studentName: `${insc.nombre} ${insc.apellido}`, coursePrice: data.workshopPrice })}
                            className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
                            title="Registrar o Ver Pagos"
                          >
                            <svg className="w-5 h-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-2m0 2H8m4 0h4m-4-8a1 1 0 01-1-1V5a1 1 0 112 0v1a1 1 0 01-1 1z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(insc._id, `${insc.nombre} ${insc.apellido}`)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar inscripción"
                          >
                            <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
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

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        itemName={deleteModal.studentName}
        itemType="al alumno"
        isDeleting={isDeleting}
      />

      {selectedForHistory && (
        <PaymentHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={closeHistoryModal}
          inscriptionId={selectedForHistory.inscriptionId}
          studentName={selectedForHistory.studentName}
          coursePrice={selectedForHistory.coursePrice}
        />
      )}
    </div>
  );
};

export default WorkshopAnalyticsPage;

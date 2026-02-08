import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getWorkshopDetails, WorkshopDetailsResponse } from '../../services/inscriptions/workshopInscriptionService';
// @ts-ignore - Spinner es un componente JavaScript sin tipos
import Spinner from '../../components/Spinner';

const WorkshopDetailsPage = () => {
  const { id: workshopId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<WorkshopDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workshopId) {
      toast.error('No se ha especificado un ID de workshop.');
      navigate('/admin/workshops');
      return;
    }

    const fetchData = async () => {
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

    fetchData();
  }, [workshopId, navigate]);

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
                <h3 className="text-xl font-bold text-gray-900">{group.turnoLabel}</h3>
                <span className="text-lg font-semibold bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                  {group.enrolled}/{group.capacity}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Estado del Pago</th>
                      <th className="p-3 text-right">Monto Pagado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.inscriptions.map((insc) => (
                      <tr key={insc._id} className="border-b">
                        <td className="p-3 capitalize">{`${insc.nombre} ${insc.apellido}`}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${insc.isFullPayment
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {insc.isFullPayment ? 'Pago Total' : 'Seña'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">
                          ${insc.depositAmount.toLocaleString('es-AR')}
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
            <p className="text-gray-500">No hay inscriptos con pago para este workshop.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopDetailsPage;


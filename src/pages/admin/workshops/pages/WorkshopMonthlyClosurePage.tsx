import { type FC, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, processMonthlyClosure, getMonthlyReports } from '../../../../services/courses/coursesService';
import type { Course, MonthlyClosureReport } from '../../../../services/courses/types';
import { Spinner } from '@/components';
import toast from 'react-hot-toast';
import ClosureConfirmationModal from '../components/ClosureConfirmationModal';

/**
 * @description Página de gestión de cierres mensuales para talleres.
 * Permite a los administradores cerrar ciclos de pago y descargar reportes históricos.
 */
const WorkshopMonthlyClosurePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estados de datos
  const [course, setCourse] = useState<Course | null>(null);
  const [reports, setReports] = useState<MonthlyClosureReport[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Configuración del cierre
  const [closureDate, setClosureDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [courseData, reportsData] = await Promise.all([
        getCourseById(id),
        getMonthlyReports(id, 1, 50)
      ]);
      setCourse(courseData);
      setReports(reportsData.data);
    } catch (error) {
      toast.error('Error al cargar datos del cierre mensual');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProcessClosure = async () => {
    if (!id) return;

    try {
      setProcessing(true);
      await processMonthlyClosure(id, closureDate);
      toast.success('Cierre mensual procesado correctamente');
      setIsModalOpen(false);
      await fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al procesar el cierre mensual';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Cierre Mensual: {course?.title}</h1>
          <p className="text-gray-500">Gestiona los cierres de ciclo y descarga reportes históricos.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Acción */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Nuevo Cierre</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Cierre</label>
                  <input
                    type="date"
                    value={closureDate}
                    onChange={(e) => setClosureDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Todos los pagos registrados hasta esta fecha (inclusive) desde el {course?.currentPaymentCycleStartDate ? new Date(course.currentPaymentCycleStartDate).toLocaleDateString() : 'el inicio'} serán incluidos en el reporte.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={processing}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center ${
                    processing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Procesar Cierre Mensual
                </button>
              </div>
              
              {course?.lastMonthlyClosureDate && (
                <div className="mt-6 pt-6 border-t border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Último Cierre</h3>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(course.lastMonthlyClosureDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Historial de Reportes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Historial de Reportes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Período</th>
                      <th className="px-6 py-4 font-semibold">Fecha Cierre</th>
                      <th className="px-6 py-4 font-semibold text-right">Recaudado</th>
                      <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reports.length > 0 ? (
                      reports.map((report) => (
                        <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">
                              {new Date(0, report.paymentMonth - 1).toLocaleString('es-ES', { month: 'long' })} {report.paymentYear}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(report.closureDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-green-600">
                            ${report.totalAmountCollected.toLocaleString('es-AR')}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <a
                              href={report.reportUrl.startsWith('http') ? report.reportUrl : `${import.meta.env.VITE_API_URL || ''}${report.reportUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Descargar CSV
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No hay reportes de cierre mensual generados para este curso.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ClosureConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleProcessClosure}
        closureDate={closureDate}
        isProcessing={processing}
      />
    </div>
  );
};

export default WorkshopMonthlyClosurePage;

import React, { useState, useEffect } from 'react';
import {
  getInscriptions,
  updateInscriptionPaymentStatus,
  getInscriptionsCount,
  exportInscriptions,
  sendBulkWaReminders,
  sendIndividualWaReminder,
} from '../../../../../services/inscriptions';
import { sendPaymentSuccessEmail, sendCoursePaidEmail } from '../../../../../services/email';
import { getCoursesAdmin } from '../../../../../services/courses';
import toast from 'react-hot-toast';
import InscriptionsListMobile from '../../components/InscriptionsListMobile';
import InscriptionsTableDesktop from '../../components/InscriptionsTableDesktop';
import Pagination from '../../../shared/components/Pagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import type { InscriptionsCount } from '../../../../../services/types';
import type { Inscription } from '../../components/types';
import type { StatCardProps, SortConfig } from './types';
import ConfirmDeleteModal from '../../../shared/components/ConfirmDeleteModal';
import { WhatsappQRModal } from '../../../../../components/WhatsappQRModal'; // Importar el nuevo modal
import { useWhatsapp } from '../../../../../context/WhatsappContext'; // Importar el hook

// --- Helper Components ---
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, loading }) => {
  if (loading) {
    return <div className="bg-white p-6 rounded-2xl shadow-lg animate-pulse h-[124px]"></div>;
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center transform hover:scale-105 transition-transform duration-300">
      <div className={`p-4 rounded-xl ${colorClass} mr-5`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};
const TotalIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PaidIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PendingIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ResultsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SearchIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


const InscriptionsAdminPage: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fechaInscripcion', direction: 'desc' });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('');
  const debouncedCourseFilter = useDebounce(courseFilter, 500);

  const [courseSuggestions, setCourseSuggestions] = useState<any[]>([]);
  const [inscriptionStats, setInscriptionStats] = useState<(InscriptionsCount & { searchTotal?: number }) | null>(null);
  const { status: waStatus } = useWhatsapp(); // Usar el estado del contexto
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Estados para modal de eliminación (necesarios si se usa ConfirmDeleteModal)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null as string | null, courseTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Lógica para el envío de mensajes (a implementar post-conexión)
  const [isSendingMessages, setIsSendingMessages] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const inscriptionsPromise = getInscriptions({
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortConfig.key,
          sortOrder: sortConfig.direction,
          search: debouncedSearchTerm,
          paymentStatusFilter,
          courseFilter: debouncedCourseFilter,
          excludeWorkshops: true
        });

        const statsPromise = getInscriptionsCount(true);

        const [inscriptionsData, statsResponse] = await Promise.all([inscriptionsPromise, statsPromise]);
        
        const finalStats = 'data' in statsResponse ? (statsResponse as any).data : statsResponse;

        if (debouncedCourseFilter) {
          finalStats.searchTotal = inscriptionsData.total;
        }

        setInscriptions(inscriptionsData.data as unknown as Inscription[]);
        setTotalItems(inscriptionsData.total);
        setInscriptionStats(finalStats);

      } catch (err: any) {
        setError(err.message || 'Error al cargar las inscripciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, sortConfig, paymentStatusFilter, debouncedCourseFilter]);

  // Reset page to 1 when searching or filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, paymentStatusFilter, debouncedCourseFilter]);

  // Fetch course suggestions when courseFilter changes
  useEffect(() => {
    if (debouncedCourseFilter) {
      const fetchSuggestions = async () => {
        try {
          const data = await getCoursesAdmin(1, 10, undefined, undefined, debouncedCourseFilter as string);
          setCourseSuggestions(data.data);
        } catch (err: any) {
          console.error('Error fetching course suggestions:', err);
        }
      };
      fetchSuggestions();
    } else {
      setCourseSuggestions([]);
    }
  }, [debouncedCourseFilter]);


  const handlePaymentStatusUpdate = async (inscriptionId: string, newStatus: 'paid' | 'pending') => {
    try {
      setLoading(true);
      await updateInscriptionPaymentStatus(inscriptionId, newStatus);

      const updatedInscriptions = inscriptions.map(inscription =>
        inscription._id === inscriptionId
          ? { ...inscription, paymentStatus: newStatus, paymentDate: newStatus === 'paid' ? new Date() : null }
          : inscription
      );
      setInscriptions(updatedInscriptions);

      // Actualizar estadísticas
      if (inscriptionStats) {
        setInscriptionStats(prevStats => {
          if (!prevStats) return prevStats;
          const newStats = { ...prevStats };
          if (newStatus === 'paid') {
            newStats.paid += 1;
            newStats.pending -= 1;
          } else { // newStatus === 'pending'
            newStats.paid -= 1;
            newStats.pending += 1;
          }
          return newStats;
        });
      }

      if (newStatus === 'paid') {
        const inscription = updatedInscriptions.find(i => i._id === inscriptionId);
        if (inscription) {
          try {
            await sendPaymentSuccessEmail(inscription as any);
            toast.success('Correo de confirmación de pago enviado.');
          } catch (emailError: any) {
            toast.error(`Error al enviar el correo: ${emailError.message}`);
          }
        }
      }

      toast.success(`Estado actualizado a ${newStatus === 'paid' ? 'pagado' : 'pendiente'} correctamente`);
    } catch (error: any) {
      toast.error('Error al actualizar el estado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCourseEmail = async (inscription: Inscription) => {
    try {
      setLoading(true);
      await sendCoursePaidEmail(inscription as any);
      toast.success('Correo con el link del curso enviado exitosamente.');
    } catch (error: any) {
      toast.error('Error al enviar el correo del curso: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await toast.promise(
      exportInscriptions(paymentStatusFilter, debouncedSearchTerm as string, debouncedCourseFilter as string, true), // excludeWorkshops
      {
        loading: 'Exportando inscripciones...',
        success: <b>Archivo descargado con éxito.</b>,
        error: (err: any) => <b>{err.message || "Error al exportar"}</b>,
      }
    );
    setIsExporting(false);
  };
  
  // Placeholder para futuras implementaciones
  const handleIndividualReminder = (id: string) => {
    if (waStatus !== 'ready') {
      toast.error("WhatsApp no está conectado. Por favor, conecte primero.");
      setIsQrModalOpen(true);
      return;
    }
    
    toast.promise(
      sendIndividualWaReminder(id),
      {
        loading: 'Enviando recordatorio...',
        success: 'Recordatorio enviado con éxito.',
        error: (err: any) => err.response?.data?.message || 'Error al enviar recordatorio.',
      }
    );
  };
  
  const handleBulkReminders = () => {
    if (waStatus !== 'ready') {
      toast.error("WhatsApp no está conectado. Por favor, conecte primero.");
      setIsQrModalOpen(true);
      return;
    }

    toast.promise(
      sendBulkWaReminders(),
      {
        loading: 'Iniciando proceso de recuperación de ventas...',
        success: (res: any) => res.message || 'El proceso de envío ha comenzado en segundo plano.',
        error: (err: any) => err.response?.data?.message || 'Error al iniciar el proceso.',
      }
    );
  }


  const handleDeleteCourse = async () => {
    // Función requerida por ConfirmDeleteModal pero no usada directamente aquí para inscripciones
    // Se deja como placeholder
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-8 py-12">

        {/* --- Header --- */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Administrador</h1>
              <p className="text-lg text-gray-500">Resumen general de inscripciones.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:auto">
              <button
                onClick={() => window.location.href = '/admin/courses'}
                className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="font-semibold">Gestionar Cursos</span>
                </div>
              </button>

              <button
                onClick={() => window.location.href = '/admin/workshops'}
                className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">Gestionar Talleres Presenciales</span>
                </div>
              </button>

              <button
                onClick={handleBulkReminders}
                className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 overflow-hidden border-2 border-green-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-93.3-25.7l-6.7-4.1-69.5 18.3L72.7 359l-4.5-7.1c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.5-8.6-44.8-27.3-16.6-14.8-27.8-33.1-31-38.7-3.3-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.6-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
                  <span className="font-bold uppercase tracking-tight">Recuperar Ventas</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className={`p-6 rounded-2xl shadow-lg border-2 ${waStatus === 'ready' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} flex items-center`}>
            <div className={`p-3 rounded-full ${waStatus === 'ready' ? 'bg-green-500' : 'bg-red-500'} text-white mr-4`}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-93.3-25.7l-6.7-4.1-69.5 18.3L72.7 359l-4.5-7.1c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.5-8.6-44.8-27.3-16.6-14.8-27.8-33.1-31-38.7-3.3-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.6-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">WhatsApp Bot</p>
              <p className={`text-lg font-extrabold ${waStatus === 'ready' ? 'text-green-700' : 'text-red-700'}`}>
                {waStatus === 'ready' ? 'CONECTADO' : 'DESCONECTADO'}
              </p>
              <div className="flex gap-2 mt-1">
                {waStatus !== 'ready' && (
                  <button 
                    onClick={() => setIsQrModalOpen(true)}
                    className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold animate-pulse hover:bg-red-200 transition-colors uppercase"
                  >
                    Conectar
                  </button>
                )}
              </div>
            </div>
          </div>
          <StatCard
            title="Total Inscripciones"
            value={inscriptionStats?.total ?? '...'}
            icon={<TotalIcon />}
            colorClass="bg-blue-100"
            loading={!inscriptionStats}
          />
          <StatCard
            title="Alumnas Pagadas"
            value={inscriptionStats?.paid ?? '...'}
            icon={<PaidIcon />}
            colorClass="bg-green-100"
            loading={!inscriptionStats}
          />
          <StatCard
            title="Pagos Pendientes"
            value={inscriptionStats?.pending ?? '...'}
            icon={<PendingIcon />}
            colorClass="bg-yellow-100"
            loading={!inscriptionStats}
          />
          {debouncedCourseFilter && (
            <StatCard
              title={`Resultados para "${debouncedCourseFilter}"`}
              value={inscriptionStats?.searchTotal ?? 0}
              icon={<ResultsIcon />}
              colorClass="bg-purple-100"
              loading={loading}
            />
          )}
        </div>

        {/* --- Main Content Area --- */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          {/* --- Search, Filter and Export --- */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:max-w-md">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Buscar por nombre, apellido, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value as 'all' | 'pending' | 'paid')}
                className="px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <option value="all">Todos los pagos</option>
                <option value="paid">Pagados</option>
                <option value="pending">Pendientes</option>
              </select>
              <div className="relative w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="Buscar curso..."
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-4 py-3 w-full border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
                {courseSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {courseSuggestions.map(course => (
                      <div
                        key={course._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setCourseFilter(course.title);
                          setCourseSuggestions([]);
                        }}
                      >
                        {course.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full md:w-auto px-6 py-3 text-center font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exportando...' : 'Exportar a Excel'}
            </button>
          </div>

          {/* --- Tables --- */}
          <InscriptionsListMobile
            inscriptions={inscriptions}
            loading={loading}
            handlePaymentStatusUpdate={handlePaymentStatusUpdate}
            handleSendCourseEmail={handleSendCourseEmail}
            onDepositClick={() => {}}
            onWaReminderClick={handleIndividualReminder}
          />
          <InscriptionsTableDesktop
            inscriptions={inscriptions}
            loading={loading}
            handlePaymentStatusUpdate={handlePaymentStatusUpdate}
            sortConfig={sortConfig}
            handleSort={handleSort}
            handleSendCourseEmail={handleSendCourseEmail}
            onDepositClick={() => {}}
            onWaReminderClick={handleIndividualReminder}
          />

          {/* --- Pagination --- */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' })}
        onConfirm={handleDeleteCourse}
        courseTitle={deleteModal.courseTitle}
        isDeleting={isDeleting}
      />

      {/* --- Nuevo Modal de WhatsApp --- */}
      <WhatsappQRModal 
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onReady={() => {
          toast.success("¡WhatsApp listo para enviar mensajes!");
          setIsQrModalOpen(false);
          // Aquí puedes habilitar la UI para enviar mensajes
          setIsSendingMessages(true);
        }}
      />
    </div>
  );
};

export default InscriptionsAdminPage;

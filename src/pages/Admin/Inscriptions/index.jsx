import React, { useState, useEffect } from 'react';
import {
  getInscriptions,
  updateInscriptionPaymentStatus,
  sendPaymentSuccessEmail,
  getInscriptionsCount,
} from '../../../services/api';
import { getCoursesAdmin } from '../../../services/courses';
import { exportInscriptions } from '../../../services/inscriptions/inscriptionsServices';
import toast from 'react-hot-toast';
import InscriptionsListMobile from './InscriptionsListMobile';
import InscriptionsTableDesktop from './InscriptionsTableDesktop';
import Pagination from './Pagination';
import { sendCoursePaidEmail } from '../../../services/email';

const API_URL = import.meta.env.VITE_API_URL;

// --- Helper Components ---

const StatCard = ({ title, value, icon, colorClass, loading }) => {
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

const TotalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PaidIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PendingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


// Hook para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const InscriptionsAdminPage = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortConfig, setSortConfig] = useState({ key: 'fechaInscripcion', direction: 'desc' });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('');
  const debouncedCourseFilter = useDebounce(courseFilter, 500);

  const [courseSuggestions, setCourseSuggestions] = useState([]);
  const [inscriptionStats, setInscriptionStats] = useState(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const fetchInscriptions = async () => {
      setLoading(true);
      try {
        const data = await getInscriptions(
          currentPage,
          itemsPerPage,
          sortConfig.key,
          sortConfig.direction,
          debouncedSearchTerm,
          paymentStatusFilter,
          debouncedCourseFilter
        );
        setInscriptions(data.data);
        setTotalItems(data.total);
      } catch (err) {
        setError(err.message || 'Error al cargar las inscripciones.');
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const statsData = await getInscriptionsCount();
        setInscriptionStats(statsData.data);
      } catch (err) {
        toast.error(err.message || 'Error al cargar las estadísticas.');
      }
    };

    fetchInscriptions();
    fetchStats();
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
          const data = await getCoursesAdmin(1, 10, undefined, undefined, debouncedCourseFilter);
          setCourseSuggestions(data.data);
        } catch (err) {
          console.error('Error fetching course suggestions:', err);
        }
      };
      fetchSuggestions();
    } else {
      setCourseSuggestions([]);
    }
  }, [debouncedCourseFilter]);


  const handlePaymentStatusUpdate = async (inscriptionId, newStatus) => {
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
            await sendPaymentSuccessEmail(inscription);
            toast.success('Correo de confirmación de pago enviado.');
          } catch (emailError) {
            toast.error(`Error al enviar el correo: ${emailError.message}`);
          }
        }
      }

      toast.success(`Estado actualizado a ${newStatus === 'paid' ? 'pagado' : 'pendiente'} correctamente`);
    } catch (error) {
      toast.error('Error al actualizar el estado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCourseEmail = async (inscription) => {
    try {
      setLoading(true);
      await sendCoursePaidEmail(inscription);
      toast.success('Correo con el link del curso enviado exitosamente.');
    } catch (error) {
      toast.error('Error al enviar el correo del curso: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await toast.promise(
      exportInscriptions(paymentStatusFilter, searchTerm, courseFilter),
      {
        loading: 'Exportando inscripciones...',
        success: <b>Archivo descargado con éxito.</b>,
        error: (err) => <b>{err.message || "Error al exportar"}</b>,
      }
    );
    setIsExporting(false);
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
  const handleItemsPerPageChange = (e) => {
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
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
            </div>
          </div>
        </div>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
              value={totalItems}
              icon={<SearchIcon />}
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
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
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
          />
          <InscriptionsTableDesktop
            inscriptions={inscriptions}
            loading={loading}
            handlePaymentStatusUpdate={handlePaymentStatusUpdate}
            sortConfig={sortConfig}
            handleSort={handleSort}
            handleSendCourseEmail={handleSendCourseEmail}
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
    </div>
  );
};

export default InscriptionsAdminPage;
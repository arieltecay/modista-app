import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoursesAdmin, deleteCourse } from '../../../services/api';
import toast from 'react-hot-toast';
import CoursesListMobile from './CoursesListMobile';
import CoursesListDesktop from './CoursesListDesktop';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

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

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const DollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>;

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

const CoursesAdminPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const [coursesStats, setCoursesStats] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null, courseTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCoursesAdmin(
          currentPage,
          itemsPerPage,
          sortConfig.key,
          sortConfig.direction,
          debouncedSearchTerm
        );
        setCourses(data.data);
        setTotalItems(data.total);

        // Calcular estadísticas
        const totalCourses = data.total;
        setCoursesStats({
          total: totalCourses,
        });

      } catch (err) {
        setError(err.message || 'Error al cargar los cursos.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, sortConfig]);

  // Reset page to 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleDeleteCourse = async () => {
    if (!deleteModal.courseId) return;

    setIsDeleting(true);
    try {
      setCourses(prev => prev.filter(c => c._id !== deleteModal.courseId));

      await deleteCourse(deleteModal.courseId);

      // Actualizar estadísticas
      if (coursesStats) {
        setCoursesStats(prev => ({
          total: prev.total - 1,
        }));
      }

      toast.success('Curso eliminado exitosamente');
    } catch (error) {
      // Revertir cambios en caso de error
      setCourses(prev => [...prev]);
      toast.error('Error al eliminar el curso: ' + error.message);
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' });
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/admin/courses/edit/${courseId}`);
  };

  const handleDelete = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    if (course) {
      setDeleteModal({
        isOpen: true,
        courseId,
        courseTitle: course.title
      });
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

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-8 py-12">

        {/* --- Header --- */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Gestión de Cursos</h1>
              <p className="text-lg text-gray-500">Administra todos los cursos de la plataforma</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="group relative px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-semibold">Volver al Dashboard</span>
                </div>
              </button>
              <button
                onClick={() => navigate('/admin/courses/add')}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-semibold">Agregar Curso</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Cursos"
            value={coursesStats?.total ?? '...'}
            icon={<BookIcon />}
            colorClass="bg-blue-100"
            loading={!coursesStats}
          />
        </div>

        {/* --- Main Content Area --- */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          {/* --- Search --- */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6 gap-4">
            <div className="relative w-full md:max-w-md">
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar por título, categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* --- Tables --- */}
          <CoursesListMobile
            courses={courses}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <CoursesListDesktop
            courses={courses}
            loading={loading}
            sortConfig={sortConfig}
            handleSort={handleSort}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />

          {/* --- Pagination --- */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Mostrar</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">por página</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default CoursesAdminPage;
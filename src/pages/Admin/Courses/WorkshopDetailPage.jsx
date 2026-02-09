import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkshopInscriptions, updateInscriptionPaymentStatus, updateInscriptionDeposit } from '../../../services/inscriptions';
import { sendPaymentSuccessEmail } from '../../../services/email/emailService';
import { getCoursesAdmin } from '../../../services/courses/coursesService';
import { getTurnosByCourse } from '../../../services/turnos/turnoService';
import toast from 'react-hot-toast';
import Spinner from '../../../components/Spinner';
import DepositModal from '../Inscriptions/components/DepositModal';

// Componentes especializados para talleres para segregar lógica de cursos online
import WorkshopInscriptionsTable from './components/WorkshopInscriptionsTable';
import WorkshopInscriptionsList from './components/WorkshopInscriptionsList';
import Pagination from '../Inscriptions/Pagination';

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [turnoFilter, setTurnoFilter] = useState('all');
  const [availableTurnos, setAvailableTurnos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'fechaInscripcion', direction: 'desc' });

  // Estado para el modal de seña
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        setLoading(true);
        // 1. Obtener info del curso
        const courses = await getCoursesAdmin(1, 100);
        // Buscar por UUID (id viene en la URL ahora es el UUID)
        const currentCourse = courses.data.find(c => c.uuid === id || c.id === id);
        setCourse(currentCourse);

        if (!currentCourse) {
          toast.error('Taller no encontrado');
          setLoading(false);
          return;
        }

        // 2. Obtener turnos del taller (pasando true para admin)
        const { data: turnos } = await getTurnosByCourse(currentCourse.uuid || currentCourse.id, true);
        setAvailableTurnos(turnos || []);

        // 3. Filtrar inscripciones usando el servicio dedicado para talleres
        const response = await getWorkshopInscriptions(currentCourse.uuid || currentCourse.id, {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortConfig.key,
          sortOrder: sortConfig.direction,
          search: searchTerm,
          paymentStatusFilter: paymentFilter,
          turnoFilter: turnoFilter !== 'all' ? turnoFilter : undefined
        });
        if (response && response.data) {
          setInscriptions(response.data);
          setTotalItems(response.total);
        } else {
          setInscriptions([]);
        }
      } catch (error) {
        toast.error('Error al cargar datos del taller');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopData();
  }, [id, currentPage, itemsPerPage, searchTerm, paymentFilter, turnoFilter, sortConfig]);

  const handlePaymentStatusUpdate = async (inscriptionId, newStatus) => {
    try {
      await updateInscriptionPaymentStatus(inscriptionId, newStatus);
      const updatedList = inscriptions.map(inv =>
        inv._id === inscriptionId ? { ...inv, paymentStatus: newStatus } : inv
      );
      setInscriptions(updatedList);

      if (newStatus === 'paid') {
        const student = updatedList.find(i => i._id === inscriptionId);
        await sendPaymentSuccessEmail(student);
        toast.success('Pago confirmado y correo enviado');
      } else {
        toast.success('Estado actualizado a pendiente');
      }
    } catch (error) {
      toast.error('Error al actualizar estado de pago');
    }
  };

  const handleDepositClick = (inscription) => {
    setSelectedInscription(inscription);
    setIsDepositModalOpen(true);
  };

  const handleDepositSubmit = async (inscriptionId, amount) => {
    try {
      setIsSubmittingDeposit(true);
      const response = await updateInscriptionDeposit(inscriptionId, amount);

      // Actualizar lista local
      const updatedList = inscriptions.map(inv =>
        inv._id === inscriptionId
          ? { ...inv, depositAmount: amount, depositDate: new Date().toISOString(), isReserved: true }
          : inv
      );
      setInscriptions(updatedList);

      toast.success('Seña registrada y correo enviado exitosamente');
      setIsDepositModalOpen(false);
    } catch (error) {
      console.error('Error recording deposit:', error);
      toast.error(error.response?.data?.message || 'Error al registrar la seña');
    } finally {
      setIsSubmittingDeposit(false);
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

  if (loading && !course) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => navigate('/admin/workshops')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a Cursos
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{course?.title}</h1>
              <p className="text-gray-500">Gestión de inscriptos y pagos para este taller.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/admin/workshops/${id}/schedule`)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver Agenda y Horarios
              </button>
              <button
                onClick={() => navigate(`/admin/workshops/more-info/${id}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm-1 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Ver Inscriptos y Pagos
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Filtros */}
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">Todos los pagos</option>
              <option value="paid">Pagados</option>
              <option value="pending">Pendientes</option>
            </select>
            <select
              value={turnoFilter}
              onChange={(e) => {
                setTurnoFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">Todos los horarios</option>
              {availableTurnos.map(turno => (
                <option key={turno._id} value={turno._id}>
                  {turno.diaSemana} - {turno.horaInicio} hs
                </option>
              ))}
            </select>
          </div>

          {/* Listado */}
          <div className="p-0">
            {inscriptions.length > 0 ? (
              <>
                <WorkshopInscriptionsTable
                  inscriptions={inscriptions}
                  loading={loading}
                  handlePaymentStatusUpdate={handlePaymentStatusUpdate}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                  onDepositClick={handleDepositClick}
                />
                <WorkshopInscriptionsList
                  inscriptions={inscriptions}
                  loading={loading}
                  handlePaymentStatusUpdate={handlePaymentStatusUpdate}
                  onDepositClick={handleDepositClick}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-white">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No hay inscriptos</h3>
                <p className="text-gray-500 max-w-sm">No se encontraron inscripciones que coincidan con los filtros seleccionados para este taller.</p>
                {(searchTerm || paymentFilter !== 'all' || turnoFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPaymentFilter('all');
                      setTurnoFilter('all');
                    }}
                    className="mt-6 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                  >
                    Limpiar todos los filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Paginación */}
          <div className="p-6 border-t border-gray-50">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              handlePrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
              handleNextPage={() => setCurrentPage(p => p + 1)}
              handleItemsPerPageChange={(e) => setItemsPerPage(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Modal de Seña */}
      {selectedInscription && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          onSubmit={handleDepositSubmit}
          inscription={selectedInscription}
          isSubmitting={isSubmittingDeposit}
        />
      )}
    </div>
  );
};

export default WorkshopDetailPage;

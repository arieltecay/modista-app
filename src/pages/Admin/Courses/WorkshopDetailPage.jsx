import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInscriptions, updateInscriptionPaymentStatus, updateInscriptionDeposit } from '../../../services/inscriptions/inscriptionService';
import { sendPaymentSuccessEmail } from '../../../services/email/emailService';
import { getCoursesAdmin } from '../../../services/courses/coursesService';
import toast from 'react-hot-toast';
import Spinner from '../../../components/Spinner';
import DepositModal from '../Inscriptions/components/DepositModal';

// Reutilizamos componentes del dashboard original para mantener consistencia
import InscriptionsTableDesktop from '../Inscriptions/InscriptionsTableDesktop';
import InscriptionsListMobile from '../Inscriptions/InscriptionsListMobile';
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

        // 2. Filtrar inscripciones por UUID del curso (exacto)
        const response = await getInscriptions(
          currentPage,
          itemsPerPage,
          'fechaInscripcion',
          'desc',
          '',  // sin búsqueda de texto
          paymentFilter,
          currentCourse.uuid || currentCourse.id  // Filtrar por UUID exacto del curso
        );
        setInscriptions(response.data);
        setTotalItems(response.total);
      } catch (error) {
        toast.error('Error al cargar datos del taller');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopData();
  }, [id, currentPage, itemsPerPage, searchTerm, paymentFilter]);

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
            <button
              onClick={() => navigate(`/admin/workshops/${id}/schedule`)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver Agenda y Horarios
            </button>
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
          </div>

          {/* Listado */}
          <div className="p-0">
            <InscriptionsTableDesktop
              inscriptions={inscriptions}
              loading={loading}
              handlePaymentStatusUpdate={handlePaymentStatusUpdate}
              sortConfig={{ key: 'fechaInscripcion', direction: 'desc' }}
              showDepositFeature={true}
              onDepositClick={handleDepositClick}
            />
            <InscriptionsListMobile
              inscriptions={inscriptions}
              loading={loading}
              handlePaymentStatusUpdate={handlePaymentStatusUpdate}
              handleSendCourseEmail={null} // O el que corresponda
              showDepositFeature={true}
              onDepositClick={handleDepositClick}
            />
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

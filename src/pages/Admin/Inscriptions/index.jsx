import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getInscriptions, updateInscriptionPaymentStatus, sendPaymentSuccessEmail } from '../../../services/api';
import toast from 'react-hot-toast';
import InscriptionsListMobile from './InscriptionsListMobile';
import InscriptionsTableDesktop from './InscriptionsTableDesktop';
import Pagination from './Pagination';

const ADMIN_SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET;
const API_URL = import.meta.env.VITE_API_URL;

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
  const [searchParams] = useSearchParams();
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortConfig, setSortConfig] = useState({ key: 'fechaInscripcion', direction: 'desc' });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const secret = searchParams.get('secret');

  useEffect(() => {
    if (secret !== ADMIN_SECRET_KEY) {
      setError('Acceso denegado. Se requiere una clave secreta válida.');
      setLoading(false);
      return;
    }

    const fetchInscriptions = async () => {
      setLoading(true);
      try {
        const data = await getInscriptions(
          currentPage, 
          itemsPerPage, 
          secret,
          sortConfig.key,
          sortConfig.direction,
          debouncedSearchTerm
        );
        setInscriptions(data.data);
        setTotalItems(data.total);
      } catch (err) {
        setError(err.message || 'Error al cargar las inscripciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchInscriptions();
  }, [currentPage, itemsPerPage, secret, debouncedSearchTerm, sortConfig]);

  // Reset page to 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handlePaymentStatusUpdate = async (inscriptionId, newStatus) => {
    try {
      setLoading(true);
      await updateInscriptionPaymentStatus(inscriptionId, newStatus, secret);

      // Actualizar estado local inmediatamente
      const updatedInscriptions = inscriptions.map(inscription =>
        inscription._id === inscriptionId
          ? { ...inscription, paymentStatus: newStatus, paymentDate: newStatus === 'paid' ? new Date() : null }
          : inscription
      );
      setInscriptions(updatedInscriptions);

      // Si el nuevo estado es 'pagado', enviar el correo de confirmación
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  
  const exportUrl = `${API_URL}/api/inscriptions/export`;

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="py-8">
        <div className="flex flex-col sm:flex-row justify-between w-full mb-4 gap-4">
          <h2 className="text-2xl leading-tight">
            Panel de Administrador
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text"
              placeholder="Buscar por nombre, apellido, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <a href={exportUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-center font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Exportar a Excel
            </a>
          </div>
        </div>

        <InscriptionsListMobile 
          inscriptions={inscriptions} 
          loading={loading} 
          handlePaymentStatusUpdate={handlePaymentStatusUpdate} 
        />

        <InscriptionsTableDesktop 
          inscriptions={inscriptions} 
          loading={loading} 
          handlePaymentStatusUpdate={handlePaymentStatusUpdate} 
          sortConfig={sortConfig} 
          handleSort={handleSort} 
        />

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
  );
};

export default InscriptionsAdminPage;

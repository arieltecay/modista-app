import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getInscriptions } from '../../../services/api';
import Spinner from '../../../components/Spinner';

const ADMIN_SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET;
const API_URL = import.meta.env.VITE_API_URL;

const InscriptionsAdminPage = () => {
  const [searchParams] = useSearchParams();
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
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
        const data = await getInscriptions(currentPage, itemsPerPage, secret);
        setInscriptions(data.data);
        setTotalItems(data.total);
      } catch (err) {
        setError(err.message || 'Error al cargar las inscripciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchInscriptions();
  }, [currentPage, itemsPerPage, secret]);

  const paginationOptions = useMemo(() => {
    const options = [10, 20, 30, 40, 50];
    // Only show options that are less than or equal to totalItems.
    // But always show at least the default option (10).
    const filteredOptions = options.filter(option => option <= totalItems);
    if (filteredOptions.length === 0 && totalItems > 0) {
        return [10];
    }
    return filteredOptions;
  }, [totalItems]);

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

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };
  
  const exportUrl = `${API_URL}/api/inscriptions/export`;

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="py-8">
        <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
          <h2 className="text-2xl leading-tight">
            Panel de Administrador de Inscripciones
          </h2>
          <a href={exportUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Exportar a Excel
          </a>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-10">
                <Spinner />
              </div>
            ) : (
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre Completo
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Celular
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha de Inscripción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.map((inscription) => (
                    <tr key={inscription._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{inscription.nombre} {inscription.apellido}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{inscription.email}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{inscription.celular}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {new Date(inscription.fechaInscripcion).toLocaleDateString('es-AR')}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <div className="flex items-center">
                <span className="text-xs xs:text-sm text-gray-900">
                  Resultados por página:
                </span>
                <select onChange={handleItemsPerPageChange} value={itemsPerPage} className="ml-2 text-sm border border-gray-300 rounded">
                  {paginationOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                   {paginationOptions.length === 0 && <option value={10}>10</option>}
                </select>
              </div>
              <span className="text-xs xs:text-sm text-gray-900">
                Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages || totalItems === 0}
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionsAdminPage;

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getInscriptions } from '../../../services/api';
import Spinner from '../../../components/Spinner';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

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

const SortableHeader = ({ children, name, sortConfig, onSort }) => {
  const isSorted = sortConfig.key === name;
  const direction = isSorted ? sortConfig.direction : undefined;

  const getIcon = () => {
    if (!isSorted) return <FaSort className="inline ml-1" />;
    if (direction === 'asc') return <FaSortUp className="inline ml-1" />;
    return <FaSortDown className="inline ml-1" />;
  };

  return (
    <th 
      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" 
      onClick={() => onSort(name)}
    >
      {children}
      {getIcon()}
    </th>
  );
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

        {/* Mobile Card View */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex justify-center items-center p-10"><Spinner /></div>
          ) : (
            inscriptions.map((inscription) => (
              <div key={inscription._id} className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-900 whitespace-normal">{inscription.nombre} {inscription.apellido}</p>
                  <span className="text-xs text-gray-600 whitespace-nowrap">{new Date(inscription.fechaInscripcion).toLocaleDateString('es-AR')}</span>
                </div>
                <p className="text-sm text-gray-700 break-all">{inscription.email}</p>
                <p className="text-sm text-gray-700">{inscription.celular}</p>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto hidden md:block">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-10"><Spinner /></div>
            ) : (
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <SortableHeader name="nombre" sortConfig={sortConfig} onSort={handleSort}>Nombre Completo</SortableHeader>
                    <SortableHeader name="email" sortConfig={sortConfig} onSort={handleSort}>Email</SortableHeader>
                    <SortableHeader name="celular" sortConfig={sortConfig} onSort={handleSort}>Celular</SortableHeader>
                    <SortableHeader name="fechaInscripcion" sortConfig={sortConfig} onSort={handleSort}>Fecha de Inscripción</SortableHeader>
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
                <span className="text-xs xs:text-sm text-gray-900">Resultados por página:</span>
                <select onChange={handleItemsPerPageChange} value={itemsPerPage} className="ml-2 text-sm border border-gray-300 rounded">
                  {[10, 20, 30, 50].map(size => (<option key={size} value={size}>{size}</option>))}
                </select>
              </div>
              <span className="text-xs xs:text-sm text-gray-900">
                Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages || totalItems === 0} className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionsAdminPage;
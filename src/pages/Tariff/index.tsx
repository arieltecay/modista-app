import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  TariffData,
  AvailableTariffMeta,
  SearchResultItem,
} from '../../services/tariff/types';
import { Spinner, ErrorCard } from '@/components';
import { getAvailableTariffMetadata as fetchAvailableTariffMetadata, getTariffs as fetchTariffs, searchTariffItems } from '../../services/tariff/tariffService';
import { TariffModista, TariffAltaCostura, TariffArreglos, DynamicTariffSection } from './components';

const useAvailableTariffsMeta = () => {
  const [meta, setMeta] = useState<AvailableTariffMeta[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [errorMeta, setErrorMeta] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const data = await fetchAvailableTariffMetadata();
        setMeta(data);
      } catch (err) {
        console.error('Error fetching tariff metadata:', err);
        setErrorMeta('Error al cargar metadatos de tarifarios disponibles.');
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, []);
  return { meta, loadingMeta, errorMeta };
};

const TariffPage: FC = () => {
  const { meta, loadingMeta, errorMeta } = useAvailableTariffsMeta();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPeriodIdentifier, setSelectedPeriodIdentifier] = useState<string>('');

  const [tariff, setTariff] = useState<TariffData | null>(null);
  const [loadingTariff, setLoadingTariff] = useState(false);
  const [errorTariff, setErrorTariff] = useState<string | null>(null);

  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const uniqueTypes = useMemo(() => {
    const types = meta.map(m => m.type);
    return Array.from(new Set(types));
  }, [meta]);

  const availablePeriodsForSelectedType = useMemo(() => {
    return meta
      .filter(m => m.type === selectedType)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [meta, selectedType]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchText.trim() === '') {
        setSearchResults([]);
        return;
      }

      if (!selectedType || !selectedPeriodIdentifier) return;

      setSearchLoading(true);
      try {
        const results = await searchTariffItems(selectedType, selectedPeriodIdentifier, searchText);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching tariff items:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText, selectedType, selectedPeriodIdentifier]);

  useEffect(() => {
    if (meta.length > 0 && !selectedType) {
      const sortedMeta = [...meta].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      const initialType = sortedMeta[0]?.type;
      if (initialType) {
        setSelectedType(initialType);
        const periodsForInitialType = sortedMeta.filter(m => m.type === initialType).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        if (periodsForInitialType.length > 0) {
          setSelectedPeriodIdentifier(periodsForInitialType[0].periodIdentifier);
        }
      }
    }
  }, [meta, selectedType]);

  useEffect(() => {
    const fetchTariff = async () => {
      if (!selectedType || !selectedPeriodIdentifier) {
        setTariff(null);
        return;
      }

      setLoadingTariff(true);
      setErrorTariff(null);
      try {
        const data = await fetchTariffs(selectedType, selectedPeriodIdentifier);
        setTariff(data);
      } catch (err) {
        console.error('Error loading selected tariff:', err);
        setErrorTariff('Error al cargar el tarifario seleccionado. Asegúrate de que existe.');
      } finally {
        setLoadingTariff(false);
      }
    };
    fetchTariff();
  }, [selectedType, selectedPeriodIdentifier]);

  const searchSections = useMemo(() => {
    if (searchText.trim() === '' || searchResults.length === 0) return [];

    const groupedResults: { [key: string]: SearchResultItem[] } = {};
    searchResults.forEach(item => {
      if (!groupedResults[item.sectionTitle]) {
        groupedResults[item.sectionTitle] = [];
      }
      groupedResults[item.sectionTitle].push(item);
    });

    return Object.keys(groupedResults).map(title => ({
      title: title,
      items: groupedResults[title]
    }));
  }, [searchText, searchResults]);

  const renderTariffComponent = (tariffData: TariffData) => {
    switch (tariffData.type) {
      case 'modista':
        return <TariffModista tariffData={tariffData} />;
      case 'alta-costura':
        return <TariffAltaCostura tariffData={tariffData} />;
      case 'costurera':
        return <TariffModista tariffData={tariffData} />;
      case 'arreglos':
        return <TariffArreglos tariffData={tariffData} />;
      default:
        return <p className="text-gray-500">Formato de tarifario no reconocido.</p>;
    }
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            {tariff?.metadata?.titulo || 'Tarifarios de Confección'}
          </h1>
          {tariff?.metadata?.notas && tariff.metadata.notas.length > 0 && (
            <div className="mt-8 mx-auto max-w-4xl p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Notas Importantes
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-left">
                {tariff.metadata.notas.map((nota, index) => (
                  <li key={index} className="flex items-start"><span className="mr-2">&#x2022;</span><span>{nota}</span></li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {tariff && (
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Buscar ítems en el tarifario actual..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        {uniqueTypes.length > 1 && (
          <div className="mb-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setSearchText('');
                    const periodsForNewType = meta.filter(m => m.type === type).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                    if (periodsForNewType.length > 0) {
                      setSelectedPeriodIdentifier(periodsForNewType[0].periodIdentifier);
                    } else {
                      setSelectedPeriodIdentifier('');
                    }
                  }}
                  className={`
                    ${selectedType === type
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg capitalize
                  `}
                >
                  {type}
                </button>
              ))}
            </nav>
          </div>
        )}

        {availablePeriodsForSelectedType.length > 1 && (
          <div className="mb-8 flex justify-end">
            <label htmlFor="period-select" className="sr-only">Seleccionar Período</label>
            <select
              id="period-select"
              value={selectedPeriodIdentifier}
              onChange={(e) => setSelectedPeriodIdentifier(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md max-w-xs"
            >
              {availablePeriodsForSelectedType.map(p => (
                <option key={p.periodIdentifier} value={p.periodIdentifier}>
                  {p.periodDescription}
                </option>
              ))}
            </select>
          </div>
        )}

        {loadingTariff || searchLoading ? (
          <Spinner text={searchLoading ? "Buscando..." : "Cargando tarifario..."} />
        ) : errorTariff ? (
          <ErrorCard title="Error al cargar tarifario" message={errorTariff} />
        ) : searchText.trim() !== '' ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
            <div className="p-4 sm:p-6">
              {searchSections.length > 0 ? (
                <DynamicTariffSection sections={searchSections} />
              ) : (
                <div className="text-center py-10 text-gray-500">
                   <p>No se encontraron resultados para "{searchText}".</p>
                </div>
              )}
            </div>
          </div>
        ) : tariff ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
            <div className="p-4 sm:p-6">
              {renderTariffComponent(tariff)}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No hay tarifarios disponibles para la selección actual.</p>
            <p>Por favor, selecciona un tipo y período si están disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TariffPage;

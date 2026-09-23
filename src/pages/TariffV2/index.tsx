import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  TariffData,
  AvailableTariffMeta,
  SearchResultItem,
} from '../../services/tariff/types';
import { Spinner, ErrorCard, SEO } from '@/components';
import { getAvailableTariffMetadata as fetchAvailableTariffMetadata, getTariffs as fetchTariffs, searchTariffItems } from '../../services/tariff/tariffService';
import { TariffModista, TariffAltaCostura, TariffArreglos, DynamicTariffSection } from '../Tariff/components';
import V2Layout from '../../components/V2Layout';

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

/**
 * Tarifario v2 — misma lógica de datos que v1 (types, períodos, búsqueda,
 * tablas), con UI "Atelier Digital": pills, cards blancas, serif editorial.
 */
const TariffV2: FC = () => {
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
    const types = meta.map((m) => m.type);
    return Array.from(new Set(types));
  }, [meta]);

  const availablePeriodsForSelectedType = useMemo(() => {
    return meta
      .filter((m) => m.type === selectedType)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [meta, selectedType]);

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
        const periods = sortedMeta
          .filter((m) => m.type === initialType)
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        if (periods.length > 0) {
          setSelectedPeriodIdentifier(periods[0].periodIdentifier);
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
        setErrorTariff('Error al cargar el tarifario seleccionado.');
      } finally {
        setLoadingTariff(false);
      }
    };
    fetchTariff();
  }, [selectedType, selectedPeriodIdentifier]);

  const searchSections = useMemo(() => {
    if (searchText.trim() === '' || searchResults.length === 0) return [];
    const groupedResults: { [key: string]: SearchResultItem[] } = {};
    searchResults.forEach((item) => {
      if (!groupedResults[item.sectionTitle]) {
        groupedResults[item.sectionTitle] = [];
      }
      groupedResults[item.sectionTitle].push(item);
    });
    return Object.keys(groupedResults).map((title) => ({
      title,
      items: groupedResults[title],
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
        return <p className="text-atelier-muted-text font-atelier-sans">Formato de tarifario no reconocido.</p>;
    }
  };

  return (
    <V2Layout>
      <SEO
        title="Tarifario de Arreglos y Confección a Medida"
        description="Precios de servicios de modista: dobladillos, cierres, botones, ajustes y confección a medida. Presupuesto sin cargo."
      />
      <div className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {loadingMeta ? (
            <TariffV2Skeleton />
          ) : errorMeta ? (
            <ErrorCard title="Error al cargar metadatos" message={errorMeta} />
          ) : (
            <>
              <header className="text-center mb-8">
                <p className="text-atelier-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 font-atelier-sans">
                  Servicios a medida
                </p>
                <h1 className="font-atelier-serif text-4xl sm:text-5xl font-semibold text-atelier-ink mb-4">
                  {tariff?.metadata?.titulo || 'Tarifarios de Confección'}
                </h1>

                {tariff?.metadata?.notas && tariff.metadata.notas.length > 0 && (
                  <div className="mt-6 mx-auto max-w-3xl p-5 bg-atelier-gold/5 rounded-2xl border border-atelier-gold/25 text-left">
                    <h3 className="text-base font-bold text-atelier-gold mb-3 font-atelier-sans">Notas importantes</h3>
                    <ul className="space-y-1.5 text-sm text-[#444842] font-atelier-sans">
                      {tariff.metadata.notas.map((nota, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-atelier-gold">•</span>
                          <span>{nota}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </header>

              {/* Tabs de tipo (pills) */}
              {uniqueTypes.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {uniqueTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type);
                        setSearchText('');
                        const periods = meta
                          .filter((m) => m.type === type)
                          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                        setSelectedPeriodIdentifier(periods.length > 0 ? periods[0].periodIdentifier : '');
                      }}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider capitalize transition-all font-atelier-sans ${
                        selectedType === type
                          ? 'bg-atelier-primary text-white shadow-md shadow-atelier-primary/20'
                          : 'bg-white text-atelier-muted-text border border-atelier-sage/20 hover:border-atelier-primary/40'
                      }`}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}

              {/* Buscador + período */}
              {tariff && (
                <div className="mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <input
                    type="text"
                    placeholder="Buscar en el tarifario (ej. dobladillo, cierre)…"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="flex-1 px-5 py-3.5 rounded-full border-2 border-atelier-sage/25 bg-white text-atelier-ink placeholder:text-atelier-muted-text/60 outline-none focus:border-atelier-primary focus:ring-4 focus:ring-atelier-primary/10 transition-all font-atelier-sans text-sm"
                  />
                  {availablePeriodsForSelectedType.length > 1 && (
                    <select
                      value={selectedPeriodIdentifier}
                      onChange={(e) => setSelectedPeriodIdentifier(e.target.value)}
                      aria-label="Seleccionar período"
                      className="px-5 py-3.5 rounded-full border-2 border-atelier-sage/25 bg-white text-atelier-ink outline-none focus:border-atelier-primary font-atelier-sans text-sm"
                    >
                      {availablePeriodsForSelectedType.map((p) => (
                        <option key={p.periodIdentifier} value={p.periodIdentifier}>
                          {p.periodDescription}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {loadingTariff ? (
                <TariffV2Skeleton />
              ) : searchLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner text="Buscando..." />
                </div>
              ) : errorTariff ? (
                <ErrorCard title="Error al cargar tarifario" message={errorTariff} />
              ) : searchText.trim() !== '' ? (
                <div className="bg-white shadow-sm overflow-hidden rounded-2xl border border-atelier-sage/10">
                  <div className="p-4 sm:p-6">
                    {searchSections.length > 0 ? (
                      <DynamicTariffSection sections={searchSections} />
                    ) : (
                      <div className="text-center py-10 text-atelier-muted-text font-atelier-sans">
                        <p>No se encontraron resultados para “{searchText}”.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : tariff ? (
                <div className="bg-white shadow-sm overflow-hidden rounded-2xl border border-atelier-sage/10">
                  <div className="p-4 sm:p-6">{renderTariffComponent(tariff)}</div>
                </div>
              ) : (
                <div className="text-center py-10 text-atelier-muted-text font-atelier-sans">
                  <p>No hay tarifarios disponibles para la selección actual.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </V2Layout>
  );
};

/** Skeleton del tarifario con la forma real del contenido. */
const TariffV2Skeleton: FC = () => (
  <div className="animate-pulse" aria-busy="true">
    <div className="h-6 w-40 bg-atelier-sage/15 rounded-full mx-auto mb-3" />
    <div className="h-10 w-72 bg-atelier-sage/15 rounded-xl mx-auto mb-8" />
    <div className="flex justify-center gap-2 mb-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-10 w-28 bg-atelier-sage/15 rounded-full" />
      ))}
    </div>
    <div className="bg-white rounded-2xl border border-atelier-sage/10 p-6 space-y-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-9 bg-atelier-sage/10 rounded-lg" />
      ))}
    </div>
  </div>
);

export default TariffV2;

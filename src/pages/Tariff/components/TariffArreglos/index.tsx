import type { FC } from 'react';
import DynamicTariffSection from '../DynamicTariffSection';
import { TariffArreglosProps } from './types';

const TariffArreglos: FC<TariffArreglosProps> = ({ tariffData }) => {
  const { content } = tariffData;

  return (
    <div className="space-y-6">
      {content.tarifas_por_hora && (
        <DynamicTariffSection
          title="Tarifas por Hora"
          items={content.tarifas_por_hora}
        />
      )}
      {content.metro_lineal && (
        <DynamicTariffSection
          title="Tarifas por Metro Lineal"
          items={content.metro_lineal}
        />
      )}
      {content.arreglos_principales && (
        <DynamicTariffSection
          title="Arreglos Principales"
          items={content.arreglos_principales}
        />
      )}
      {content.nota_final && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100 text-sm text-gray-600 italic">
          <p>&#x2022; {content.nota_final}</p>
        </div>
      )}
    </div>
  );
};

export default TariffArreglos;

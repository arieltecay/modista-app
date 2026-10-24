import type { FC } from 'react';
import DynamicTariffSection from '../DynamicTariffSection';
import { TariffArreglosProps } from './types';
import { TariffSection } from '../../../../services/tariff/types';

const TariffArreglos: FC<TariffArreglosProps> = ({ tariffData }) => {
  const { content } = tariffData;
  const sections: TariffSection[] = [];

  if (content.tarifas_por_hora && content.tarifas_por_hora.length > 0) {
    sections.push({ title: "Tarifas por Hora", items: content.tarifas_por_hora });
  }

  if (content.metro_lineal && content.metro_lineal.length > 0) {
    sections.push({ title: "Tarifas por Metro Lineal", items: content.metro_lineal });
  }

  if (content.arreglos_principales && content.arreglos_principales.length > 0) {
    sections.push({ title: "Arreglos Principales", items: content.arreglos_principales });
  }

  if (content.nota_final) {
    sections.push({ title: "Nota Importante", items: [{ item: content.nota_final, descripcion: content.nota_final }] });
  }
  if (sections.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay datos de Arreglos disponibles.
      </div>
    );
  }

  return <DynamicTariffSection sections={sections} />;
};

export default TariffArreglos;

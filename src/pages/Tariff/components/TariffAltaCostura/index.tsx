import type { FC } from 'react';
import { TariffSection } from '../../../../api/types/shared-tariff-types.js'; // Importación corregida
import DynamicTariffSection from '../DynamicTariffSection';
import { TariffAltaCosturaProps } from './types';


const TariffAltaCostura: FC<TariffAltaCosturaProps> = ({ tariffData }) => {
  const { content } = tariffData;
  const sections: TariffSection[] = [];

  if (content.categorias) {
    Object.keys(content.categorias).forEach((key) => {
      const categoria = content.categorias[key];
      if (categoria.nombre && categoria.prendas && categoria.prendas.length > 0) {
        const items = [...categoria.prendas];
        if (categoria.nota_agregado_bordado) {
          items.push({ item: `Nota: ${categoria.nota_agregado_bordado}`, descripcion: categoria.nota_agregado_bordado, precio: undefined });
        }
        if (categoria.nota_agregado) {
          items.push({ item: `Nota: ${categoria.nota_agregado}`, descripcion: categoria.nota_agregado, precio: undefined });
        }
        sections.push({ title: categoria.nombre, items: items });
      }
    });
  }

  if (content.tarifas_por_hora && content.tarifas_por_hora.length > 0) {
    sections.push({ title: "Tarifas por Hora", items: content.tarifas_por_hora });
  }

  if (content.metro_lineal && content.metro_lineal.length > 0) {
    sections.push({ title: "Tarifas por Metro Lineal", items: content.metro_lineal });
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay datos de Alta Costura disponibles.
      </div>
    );
  }

  return <DynamicTariffSection sections={sections} />;
};

export default TariffAltaCostura;

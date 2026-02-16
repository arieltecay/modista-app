import type { FC } from 'react';
import { DynamicItem } from '../../../../services/tariff/types';
import DynamicTariffSection from '../DynamicTariffSection';
import { TariffAltaCosturaProps } from './types';


const TariffAltaCostura: FC<TariffAltaCosturaProps> = ({ tariffData }) => {
  const { content } = tariffData;

  return (
    <div className="space-y-6">
      {content.categorias && (
        <>
          {Object.keys(content.categorias).map((key) => {
            const categoria = content.categorias[key];
            const additionalNotes: DynamicItem[] = [];
            if (categoria.nota_agregado_bordado) {
              additionalNotes.push({ item: categoria.nota_agregado_bordado, precio: undefined });
            }
            if (categoria.nota_agregado) {
              additionalNotes.push({ item: categoria.nota_agregado, precio: undefined });
            }

            return (
              <div key={key}>
                <DynamicTariffSection
                  title={categoria.nombre}
                  items={categoria.prendas}
                />
                {additionalNotes.length > 0 && (
                  <div className="ml-8 -mt-4 mb-6 text-sm text-gray-600 space-y-1">
                    {additionalNotes.map((note, idx) => (
                      <p key={idx} className="italic">&#x2022; {note.item}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
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
    </div>
  );
};

export default TariffAltaCostura;

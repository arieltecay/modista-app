import type { FC } from 'react';
import DynamicTariffSection from '../DynamicTariffSection';
import { TariffModistaProps } from './types';


const TariffModista: FC<TariffModistaProps> = ({ tariffData }) => {
  const { content } = tariffData;

  return (
    <div className="space-y-6">
      {content.tarifas_por_hora && (
        <DynamicTariffSection
          title="Tarifas por Hora"
          items={content.tarifas_por_hora}
        />
      )}
      {content.prendas_principales && (
        <DynamicTariffSection
          title="Prendas Principales"
          items={content.prendas_principales}
        />
      )}
      {content.agregados && (
        <DynamicTariffSection
          title="Agregados"
          items={content.agregados.map((item: any) => ({ item: item.descripcion }))}
        />
      )}
      {content.anexos && (
        <>
          {Object.keys(content.anexos).map((key) => {
            const anexo = content.anexos[key];
            return (
              <DynamicTariffSection
                key={key}
                title={anexo.nombre}
                items={anexo.items}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TariffModista;

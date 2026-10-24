import type { FC } from 'react';
import DynamicTariffSection from '../DynamicTariffSection';
import { TariffModistaProps } from './types';
import { TariffCostureraContent, TariffSection, TariffModistaNewContent } from '../../../../services/tariff/types';


const TariffModista: FC<TariffModistaProps> = ({ tariffData }) => {
  const { content, type } = tariffData;

  if (type === 'costurera') {
    const sections: TariffSection[] = [];
    const costureraContent = content as TariffCostureraContent;
    if (costureraContent.servicios && costureraContent.servicios.length > 0) {
      sections.push({ title: "Servicios Generales", items: costureraContent.servicios });
    }
    return <DynamicTariffSection sections={sections} />;
  }

  const sections: TariffSection[] = [];
  const modistaContent = content as TariffModistaNewContent;

  if (modistaContent.serviciosModista && modistaContent.serviciosModista.length > 0) {
    sections.push({ title: tariffData.metadata.titulo, items: modistaContent.serviciosModista });
  }

  return <DynamicTariffSection sections={sections} />;
};

export default TariffModista;

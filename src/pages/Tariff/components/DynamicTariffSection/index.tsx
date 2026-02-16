import type { FC } from 'react';
import type { DynamicItem } from './types.ts';

interface DynamicSectionProps {
  title: string;
  items: DynamicItem[];
}

const DynamicTariffSection: FC<DynamicSectionProps> = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li key={index} className="py-3 flex items-start">
            <span className="text-gray-700 font-medium break-words flex-grow mr-4">
              {item.item || item.descripcion}
            </span>
            {item.precio !== undefined && (
              <span className="text-indigo-600 font-semibold flex-shrink-0 whitespace-nowrap ml-auto">
                $ {item.precio.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DynamicTariffSection;

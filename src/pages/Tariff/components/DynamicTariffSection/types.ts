import { DynamicItem } from '../../../../api/types/shared-tariff-types.js';

export interface DynamicCategory {
  nombre: string;
  prendas?: DynamicItem[];
  items?: DynamicItem[];
}

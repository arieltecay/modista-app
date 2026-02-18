export interface IPeriod {
  inicio: string;
  fin: string;
}

export interface IContacto {
  email: string;
  nota: string;
}

export interface ITariffMetadataNew {
  titulo: string;
  organizacion: string;
  periodo: IPeriod;
  descripcion: string;
  nota_precios: string;
  nota_adicional: string;
  moneda: string;
  contacto: IContacto;
  ultimaActualizacion?: string;
  version?: string;
  notas?: string[];
}

export interface TariffData {
  _id: string;
  type: string;
  periodIdentifier: string;
  metadata: ITariffMetadataNew;
  startDate: string;
  content: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailableTariffMeta {
  _id: string;
  type: string;
  title: string;
  periodIdentifier: string;
  startDate: string;
}

export { DynamicItem, TariffSection, SearchResultItem } from '../../../api/types/shared-tariff-types.js';

export interface DynamicCategory {
  nombre: string;
  prendas?: DynamicItem[];
  items?: DynamicItem[];
}

export interface TariffCostureraContent {
  servicios: DynamicItem[];
}

export interface TariffModistaNewContent {
  serviciosModista: DynamicItem[];
}

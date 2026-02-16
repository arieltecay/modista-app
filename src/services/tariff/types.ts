// --- Interfaces adaptadas a la nueva estructura de los JSON y al modelo flexible ---

export interface IPeriod {
  inicio: string;
  fin: string;
}

export interface IContacto {
  email: string;
  nota: string;
}

// ITariffMetadataNew (Adaptada para coincidir con la metadata de los nuevos JSONs)
export interface ITariffMetadataNew {
  titulo: string;
  organizacion: string; // Ahora es un string directo, no un objeto
  periodo: IPeriod;
  descripcion: string;
  nota_precios: string;
  nota_adicional: string;
  moneda: string;
  contacto: IContacto;
  // Campos añadidos en el seed o que pueden venir:
  ultimaActualizacion?: string;
  version?: string;
  notas?: string[]; // Array consolidado en el seed
}

// TariffData (interfaz principal para el tarifario completo, adaptada con 'content')
export interface TariffData {
  _id: string;
  type: string;
  periodIdentifier: string;
  startDate: string; // Fecha en formato string ISO
  metadata: ITariffMetadataNew;
  content: Record<string, any>; // Tipo flexible para el contenido dinámico de tarifas
  createdAt?: string;
  updatedAt?: string;
}

// AvailableTariffMeta (sin cambios funcionales, solo la proyección del backend)
export interface AvailableTariffMeta {
  _id: string;
  type: string;
  title: string; // Corresponde a metadata.titulo
  periodDescription: string; // Reconstruido en el backend
  periodIdentifier: string;
  startDate: string; // Fecha en formato string ISO
}

// Interfaces adicionales para el renderizado dinámico en el frontend (TariffPage.tsx)
// No es estrictamente necesario exportarlas desde aquí, pero ayuda a la claridad
export interface DynamicItem {
  item: string;
  precio?: number; // Precio es opcional en algunos items
  descripcion?: string; // Para items como las notas en "agregados"
}

export interface DynamicCategory {
  nombre: string;
  prendas?: DynamicItem[]; // Para molderia
  items?: DynamicItem[]; // Para modista, anexos
}

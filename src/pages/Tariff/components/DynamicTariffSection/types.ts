// Interfaces para el renderizado dinámico en el frontend
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

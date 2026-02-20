/**
 * Representa un ítem individual dentro de una sección de tarifario.
 * Duplica la forma del DTO, pero es independiente del backend.
 */
export interface TariffItem {
  item?: string;
  descripcion?: string;
  precio?: number;
}

/**
 * Sección de tarifario que agrupa ítems bajo un título.
 */
export interface TariffSectionUI {
  title: string;
  items: TariffItem[];
}

/**
 * Props del componente DynamicTariffSection.
 */
export interface DynamicSectionProps {
  sections: TariffSectionUI[];
}

import type { DynamicItem, TariffData } from "@/services/tariff/types";

export interface TariffAltaCosturaProps {
  tariffData: TariffData;
}

export interface DynamicSectionProps {
  title: string;
  items: DynamicItem[];
}
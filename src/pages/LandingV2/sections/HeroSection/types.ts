import type { PriceInfo } from '../../types';

export interface HeroSectionProps {
  title: string;
  description?: string;
  imageUrl?: string;
  price: PriceInfo;
  ctaText: string;
  isPresencial?: boolean;
  /** Ref a la sección del form (scroll sin selectores frágiles) */
  formRef: React.RefObject<HTMLElement | null>;
}

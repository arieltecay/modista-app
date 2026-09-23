export interface Course {
  id: string;
  _id?: string;
  uuid?: string;
  title: string;
  description: string;
  price: number;
  shortDescription?: string;
  longDescription?: string;
  videoUrl?: string;
  imageUrl?: string;
  deeplink?: string;
  isPresencial?: boolean;
  /** Badge "Top Ventas" — lo marca la admin (contenido real) */
  isTopSeller?: boolean;
}
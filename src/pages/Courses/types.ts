export interface Course {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  shortDescription?: string;
  longDescription?: string;
  videoUrl?: string;
  imageUrl?: string;
  deeplink?: string;
  isPresencial?: boolean;
}
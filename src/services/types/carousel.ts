export interface CarouselSlide {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  order: number;
  isActive: boolean;
}

export interface CarouselSlideFormData {
  title: string;
  subtitle?: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  order?: number;
  isActive?: boolean;
}

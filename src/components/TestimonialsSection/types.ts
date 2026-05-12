export interface Testimonial {
  id: string;
  _id?: string;
  name: string;
  description: string;
  role?: string;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
}
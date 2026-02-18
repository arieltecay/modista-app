export interface InscriptionCourse {
  id?: string; // It can be `id` or `_id` depending on where it comes from
  _id?: string;
  title?: string;
  price?: string | number;
  shortDescription?: string;
  deeplink?: string;
  isPresencial?: boolean;
}

export interface InscriptionFormData {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
}

export interface InscriptionFormErrors {
  nombre?: string | null;
  apellido?: string | null;
  email?: string | null;
  celular?: string | null;
  turno?: string | null;
}

export interface FormMessage {
  type: 'success' | 'error';
  text: string;
}

export interface InscriptionFormProps {
  course: InscriptionCourse;
}

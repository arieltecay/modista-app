export interface InscriptionCourse {
  id?: string;
  _id?: string;
  title?: string;
  price?: number;
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

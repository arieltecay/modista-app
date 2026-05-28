export interface LocalCourse {
  id: string;
  uuid?: string;
  _id?: string;
  title: string;
  price: number;
}

export interface LocalLandingPage {
  id?: string;
  _id?: string;
  buttonText?: string;
}

export interface CreateLandingInscriptionPayload {
  fullName: string;
  email: string;
  celular: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  landingPageId: string;
  marketingSource?: string;
  utmParams?: Record<string, string | null | undefined>;
  sessionId?: string;
}

export interface LandingInscriptionFormProps {
  course: LocalCourse;
  landingPage: LocalLandingPage;
}

export interface FormState {
  fullName: string;
  email: string;
  celular: string;
}

export interface FormMessage {
  type: 'success' | 'error';
  text: string;
}

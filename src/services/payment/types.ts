export type PaymentStatusValue = 'pending' | 'paid' | 'partial' | 'rejected' | 'in_process';

export type PaymentSource = 'webhook' | 'manual' | 'link_static';

export interface PaymentStatusResponse {
  paymentStatus: PaymentStatusValue;
  paymentDate?: string | null;
  courseTitle: string;
  coursePrice: number;
  totalPaid: number;
  paymentSource: PaymentSource | null;
}

export interface CreatePreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string | null;
}

export interface InscriptionCreateResponse {
  success: boolean;
  data: any;
  mpPaymentLink: string | null;
  mpInitPoint?: string | null;
  sandboxInitPoint?: string | null;
  mpPreferenceId?: string | null;
}

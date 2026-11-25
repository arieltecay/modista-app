interface CheckoutDestinationInput {
  coursePrice: number;
  inscriptionId?: string;
  isDevelopment: boolean;
  mpInitPoint?: string | null;
  sandboxInitPoint?: string | null;
  mpPaymentLink?: string | null;
}

export const resolveCheckoutDestination = ({
  coursePrice,
  inscriptionId,
  isDevelopment,
  mpInitPoint,
  sandboxInitPoint,
  mpPaymentLink,
}: CheckoutDestinationInput): { kind: 'payment' | 'recovery'; url: string } | null => {
  const paymentUrl = (isDevelopment ? sandboxInitPoint || mpInitPoint : mpInitPoint) || mpPaymentLink;
  if (paymentUrl) return { kind: 'payment', url: paymentUrl };
  if (coursePrice > 0 && inscriptionId) {
    return {
      kind: 'recovery',
      url: `/payment/failure?inscription_id=${encodeURIComponent(inscriptionId)}&reason=checkout_unavailable`,
    };
  }
  return null;
};

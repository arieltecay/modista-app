export interface AppliedCoupon {
  code: string;
  listPrice: number;
  discountAmount: number;
  finalPrice: number;
}

export interface CouponFieldProps {
  /** Mismo identificador de curso con el que se envía la inscripción. */
  courseId: string;
  /** Cupón ya aplicado, o null. */
  applied: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  appearance?: 'checkout' | 'landing';
}

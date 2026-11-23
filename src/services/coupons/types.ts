export interface CouponAccepted {
    valid: true;
    code: string;
    listPrice: number;
    discountAmount: number;
    finalPrice: number;
}

export interface CouponRejected {
    valid: false;
    message: string;
}

export type CouponValidation = CouponAccepted | CouponRejected;

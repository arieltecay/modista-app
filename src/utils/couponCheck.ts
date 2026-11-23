/**
 * Lógica pura del campo de cupón: decide qué mostrar a partir de la respuesta del servidor.
 */

export interface AppliedCouponData {
  code: string;
  listPrice: number;
  discountAmount: number;
  finalPrice: number;
}

export type CouponCheckOutcome =
  | { kind: 'applied'; coupon: AppliedCouponData }
  | { kind: 'rejected'; message: string };

type CouponValidator = (
  code: string,
  courseId: string
) => Promise<
  | { valid: true; code: string; listPrice: number; discountAmount: number; finalPrice: number }
  | { valid: false; message: string }
>;

const EMPTY_CODE_MESSAGE = 'Ingresá un código de cupón';
const TOO_MANY_ATTEMPTS_MESSAGE =
  'Hiciste demasiados intentos. Esperá unos minutos para probar otro cupón; mientras tanto podés inscribirte sin cupón.';
const FAILED_CHECK_MESSAGE = 'No pudimos verificar el cupón. Probá de nuevo en unos minutos.';

/** Verifica un código; cualquier falla se vuelve un mensaje amable, nunca técnico (el 429 pide esperar). */
export const checkCoupon = async (code: string, courseId: string, validate: CouponValidator): Promise<CouponCheckOutcome> => {
  const trimmed = code.trim();
  if (trimmed === '') return { kind: 'rejected', message: EMPTY_CODE_MESSAGE };

  try {
    const result = await validate(trimmed, courseId);
    if (!result.valid) return { kind: 'rejected', message: result.message };
    const { code: acceptedCode, listPrice, discountAmount, finalPrice } = result;
    return { kind: 'applied', coupon: { code: acceptedCode, listPrice, discountAmount, finalPrice } };
  } catch (error) {
    const tooManyAttempts = (error as { status?: number } | null)?.status === 429;
    return { kind: 'rejected', message: tooManyAttempts ? TOO_MANY_ATTEMPTS_MESSAGE : FAILED_CHECK_MESSAGE };
  }
};

/** Lo que se le cobra: el precio con cupón si hay uno aplicado, o el del curso. */
export const payableAmount = (listPrice: number | undefined, coupon: { finalPrice: number } | null): number =>
  coupon ? coupon.finalPrice : listPrice ?? 0;

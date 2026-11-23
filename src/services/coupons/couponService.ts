/**
 * @file Servicio de cupones de descuento (lado público)
 * @module services/coupons
 */

import { apiClient } from '../config/apiClient';
import type { CouponValidation } from './types';

/**
 * Pregunta al servidor qué precio final da un código para un curso.
 * El servidor es la única autoridad: al inscribirse recalcula el precio con el mismo código.
 */
export const validateCoupon = (code: string, courseId: string): Promise<CouponValidation> =>
    apiClient.post('/coupons/validate', { code: code.trim(), courseId });

/**
 * ¿El formulario de este curso debe ofrecer el campo de cupón? El servidor responde que sí solo si hay
 * algún cupón usable ahora para el curso; no devuelve códigos.
 */
export const getCouponAvailability = (courseId: string): Promise<{ available: boolean }> =>
    apiClient.get('/coupons/availability', { params: { courseId } });

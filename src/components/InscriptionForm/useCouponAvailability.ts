import { useEffect, useState } from 'react';
import { getCouponAvailability } from '../../services/coupons/couponService';
import { isCouponFieldAvailable } from '../../utils/couponAvailability';

/** True once the server says some coupon can be used on the course; false while asking and if the question fails. */
export const useCouponAvailability = (courseId: string, enabled: boolean): boolean => {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setAvailable(false);
      return;
    }
    let cancelled = false;
    isCouponFieldAvailable(courseId, getCouponAvailability).then((result) => {
      if (!cancelled) setAvailable(result);
    });
    return () => {
      cancelled = true;
    };
  }, [courseId, enabled]);

  return available;
};

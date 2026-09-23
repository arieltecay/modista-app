import React, { useEffect, useRef } from 'react';
import LandingForm from '../../form/LandingForm';
import { trackV2, usePricingVisibleOnce } from '../../hooks/use-landing-tracking';
import type { CourseData, LandingPageData, PriceInfo } from '../../types';

interface FormSectionProps {
  course: CourseData;
  landing: LandingPageData;
  price: PriceInfo;
}

/**
 * Sección de cierre: precio destacado + formulario blindado + medios de pago.
 * Emite form_view cuando entra al viewport y pricing_visible por el precio.
 */
const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(({ course, landing, price }, ref) => {
  const priceRef = useRef<HTMLDivElement | null>(null);
  const courseId = course.uuid || course.id || course._id;
  usePricingVisibleOnce(priceRef, { courseId, courseTitle: course.title, value: course.price });

  useEffect(() => {
    const formSection = (ref as React.RefObject<HTMLElement | null>)?.current;
    if (!formSection || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackV2('form_view', { courseId: course.id, courseTitle: course.title });
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(formSection);
    return () => observer.disconnect();
  }, [ref, course.id, course.title]);

  return (
    <section ref={ref} id="inscripcion" className="py-12 px-4 sm:px-6 bg-atelier-canvas scroll-mt-4">
      <div className="max-w-md mx-auto text-center mb-6">
        <h2 className="font-atelier-serif text-3xl sm:text-4xl font-semibold mb-2 text-atelier-ink">
          Empezá hoy
        </h2>
        <p className="text-atelier-muted-text text-sm mb-4 font-atelier-sans">
          Completá el formulario y accedé al curso en minutos
        </p>
        {price.formatted && (
          <div ref={priceRef} className="inline-block bg-white rounded-2xl px-8 py-4 shadow-[0_2px_16px_rgba(91,114,99,0.08)] border border-atelier-sage/10">
            <span className="text-3xl font-bold text-atelier-ink font-atelier-sans">{price.formatted}</span>
            <span className="block text-atelier-muted-text text-xs mt-1 font-atelier-sans">Pago único · acceso inmediato</span>
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_28px_rgba(91,114,99,0.1)] border border-atelier-sage/10">
          <LandingForm course={course} landing={landing} />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-atelier-muted-text font-atelier-sans">
            <span>MercadoPago · Tarjetas · Transferencia</span>
          </div>
        </div>
      </div>
    </section>
  );
});

FormSection.displayName = 'FormSection';

export default FormSection;

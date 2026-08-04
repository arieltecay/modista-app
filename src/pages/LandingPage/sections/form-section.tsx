import React, { useEffect } from 'react';
import { CourseData, LandingPageData } from '../types';
import { LandingInscriptionForm } from '@/components';

interface FormSectionProps {
  course: CourseData;
  landing: LandingPageData;
  formattedPrice: string | null;
}

const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(({ course, landing, formattedPrice }, ref) => {
  useEffect(() => {
    const formSection = document.getElementById('inscripcion');
    if (!formSection || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          import('../../../utils/funnel-tracker').then(({ trackFunnel }) => {
            trackFunnel('form_view', { courseId: course.id, courseTitle: course.title });
          });
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(formSection);
    return () => observer.disconnect();
  }, [course.id, course.title]);

  return (
    <section ref={ref} id="inscripcion" className="py-8 px-4 sm:px-6 scroll-mt-4 bg-white">
      <div className="max-w-md mx-auto text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-[#141b2b]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
          Empezá hoy
        </h2>
        <p className="text-[#747872] text-sm mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
          Completá el formulario y accedé al curso en minutos
        </p>
        {formattedPrice && (
          <div className="inline-block bg-[#FDFBF7] rounded-2xl px-6 py-3 shadow-[0_2px_12px_rgba(81,96,80,0.06)]">
            <span className="text-3xl font-bold text-[#141b2b]" style={{ fontFamily: "'Inter', sans-serif" }}>{formattedPrice}</span>
            <span className="block text-[#747872] text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Pago único · acceso inmediato</span>
          </div>
        )}
      </div>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(81,96,80,0.08)]">
          <LandingInscriptionForm course={course as any} landingPage={landing as any} />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-[#747872]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span>MercadoPago · Tarjetas · Transferencia</span>
          </div>
        </div>
      </div>
    </section>
  );
});

FormSection.displayName = 'FormSection';

export default FormSection;
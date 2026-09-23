import { Link } from 'react-router-dom';
import { InscriptionForm, SEO, CourseImage } from '@/components';
import V2Layout from '../../components/V2Layout';
import { formatTextToHtml } from '../../utils/textFormatting';
import { shouldShowInscription } from '../../utils/courseUtils';
import { getOptimizedUrl } from '../../utils/image-utils';
import { useCourseDetail } from './hooks/use-course-detail';
import CourseDetailV2Skeleton from './components/CourseDetailV2Skeleton';

/**
 * Course Detail V2 — página de venta orgánica (componente presentacional).
 *
 * - Datos/tracking/refs en `hooks/use-course-detail.ts`.
 * - InscriptionForm: reutiliza el componente probado (turnos presenciales,
 *   honeypot, cadena de conversión intacta). NO se reescribe el motor.
 * - Sin video (decisión de performance del producto).
 */
function CourseDetailV2() {
  const vm = useCourseDetail();

  if (vm.loading) {
    return (
      <V2Layout>
        <CourseDetailV2Skeleton />
      </V2Layout>
    );
  }

  if (vm.error) {
    return (
      <V2Layout>
        <div className="text-center py-16 text-red-500 font-atelier-sans">Error: {vm.error}</div>
      </V2Layout>
    );
  }

  const course = vm.course;

  if (!course) {
    return (
      <V2Layout>
        <div className="text-center py-16">
          <h1 className="font-atelier-serif text-3xl font-semibold text-atelier-ink">Curso no encontrado</h1>
          <Link to="/cursos" className="text-atelier-primary hover:underline text-sm mt-4 inline-block font-atelier-sans">
            ← Volver al catálogo
          </Link>
        </div>
      </V2Layout>
    );
  }

  return (
    <V2Layout>
      <SEO
        title={course.title}
        description={course.shortDescription || course.description}
        ogImage={getOptimizedUrl(course.imageUrl, 1200, 630)}
        ogType="product"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.shortDescription || course.description,
          provider: { '@type': 'LocalBusiness', name: 'Modista App', url: 'https://modista-app.com' },
          offers: {
            '@type': 'Offer',
            price: course.price,
            priceCurrency: 'ARS',
            availability: 'https://schema.org/InStock',
          },
          image: getOptimizedUrl(course.imageUrl, 1200, 630),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 font-atelier-sans text-sm" aria-label="breadcrumb">
          <Link to="/" className="text-atelier-muted-text hover:text-atelier-primary transition-colors">Inicio</Link>
          <span className="text-atelier-muted-text/50 mx-2">/</span>
          <Link to="/cursos" className="text-atelier-muted-text hover:text-atelier-primary transition-colors">Cursos</Link>
          <span className="text-atelier-muted-text/50 mx-2">/</span>
          <span className="text-atelier-ink font-medium">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_380px] gap-8 items-start">
          {/* Columna contenido */}
          <div ref={vm.heroRef}>
            <div className="relative">
              <CourseImage
                course={course}
                className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg shadow-atelier-primary/10"
                width={1200}
                height={900}
                priority
                crop="limit"
              />
              {course.isTopSeller && (
                <span className="absolute top-4 left-4 bg-atelier-gold text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow font-atelier-sans">
                  🏆 Top Ventas
                </span>
              )}
              {course.isPresencial && (
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-atelier-primary text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-atelier-sans">
                  Presencial
                </span>
              )}
            </div>

            <h1 className="font-atelier-serif text-3xl sm:text-4xl font-semibold text-atelier-ink mt-7 mb-3 leading-tight">
              {course.title}
            </h1>

            {course.shortDescription && (
              <p className="text-[#444842] text-base leading-relaxed mb-6 font-atelier-sans">
                {course.shortDescription}
              </p>
            )}

            <div
              className="text-[#444842] text-base leading-relaxed font-atelier-sans"
              dangerouslySetInnerHTML={{ __html: formatTextToHtml(course.longDescription || '') }}
            />
          </div>

          {/* Purchase card — sticky en desktop */}
          <aside className="lg:sticky lg:top-24">
            <div
              ref={vm.priceRef}
              data-pricing
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_28px_rgba(91,114,99,0.12)] border border-atelier-sage/10"
            >
              {vm.isFree ? (
                <p className="text-atelier-primary font-bold text-3xl font-atelier-sans mb-1">Gratis</p>
              ) : (
                <>
                  <p className="text-atelier-ink font-bold text-3xl font-atelier-sans">{vm.formattedPrice}</p>
                  <p className="text-atelier-muted-text text-xs mb-1 font-atelier-sans">Pago único · acceso de por vida</p>
                </>
              )}

              <div className="my-5 space-y-2.5 font-atelier-sans text-sm text-[#444842]">
                <p className="flex items-center gap-2"><span className="text-atelier-primary">✓</span> Acceso inmediato</p>
                <p className="flex items-center gap-2"><span className="text-atelier-primary">✓</span> Clases paso a paso</p>
                <p className="flex items-center gap-2"><span className="text-atelier-primary">✓</span> Soporte directo por WhatsApp</p>
                <p className="flex items-center gap-2"><span className="text-atelier-primary">✓</span> Garantía de satisfacción</p>
              </div>

              {shouldShowInscription(course.price) && (
                <button
                  onClick={vm.scrollToForm}
                  className="w-full bg-atelier-pop hover:bg-atelier-pop-dark text-white font-bold uppercase tracking-wide text-base py-4 px-6 rounded-full shadow-lg shadow-atelier-pop/25 transition-all active:scale-[0.98] font-atelier-sans"
                >
                  {vm.isFree ? 'Acceder gratis' : 'Quiero inscribirme'}
                </button>
              )}

              <p className="text-center text-[11px] text-atelier-muted-text mt-4 font-atelier-sans">
                🔒 Pagás con MercadoPago · 100% seguro
              </p>
            </div>
          </aside>
        </div>

        {/* Form de inscripción (componente probado, cadena de conversión intacta) */}
        {shouldShowInscription(course.price) && (
          <div ref={vm.formRef} className="mt-10 scroll-mt-6">
            <InscriptionForm course={course} />
          </div>
        )}
      </div>

      {/* Sticky CTA mobile (con refs, sin selectores frágiles) */}
      {!vm.isFree && vm.showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-atelier-canvas/95 backdrop-blur-md border-t border-atelier-sage/15 p-3 md:hidden">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-atelier-muted-text font-medium truncate font-atelier-sans">{course.title}</span>
              <span className="text-lg font-black text-atelier-primary font-atelier-sans">{vm.formattedPrice}</span>
            </div>
            <button
              onClick={vm.scrollToForm}
              className="bg-atelier-pop text-white py-3 px-6 rounded-full text-sm font-bold uppercase tracking-wide shadow-md shadow-atelier-pop/25 active:scale-[0.97] transition-all whitespace-nowrap font-atelier-sans"
            >
              Inscribirme
            </button>
          </div>
        </div>
      )}
    </V2Layout>
  );
}

export default CourseDetailV2;

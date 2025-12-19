import React from 'react';
import { useTestimonials } from '../../hooks/useTestimonials';
import { TESTIMONIALS_CONFIG, TESTIMONIALS_MESSAGES } from '../../constants/testimonials.constants';
import TestimonialCard from './TestimonialCard';

/**
 * Sección completa de testimonios con lógica de paginación
 * Usa el hook useTestimonials para manejar estado
 */
export const TestimonialsSection: React.FC = React.memo(() => {
    const {
        testimonials,
        visibleTestimonials,
        loading,
        error,
        showAll,
        toggleShowAll,
    } = useTestimonials();

    if (loading) {
        return (
            <p className="text-center text-gray-600 py-10">
                {TESTIMONIALS_MESSAGES.LOADING}
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-center text-red-600 py-10">
                {TESTIMONIALS_MESSAGES.ERROR_PREFIX} {error.message}
            </p>
        );
    }

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
                {TESTIMONIALS_MESSAGES.SECTION_TITLE}
            </h2>

            <div className={`grid ${TESTIMONIALS_CONFIG.GRID_COLS} gap-8`}>
                {visibleTestimonials.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
            </div>

            {testimonials.length > TESTIMONIALS_CONFIG.INITIAL_COUNT && (
                <div className="text-center mt-10">
                    <button
                        onClick={toggleShowAll}
                        className="rounded-md bg-[var(--color-green-600)] px-3.5 py-2.5 text-sm font-semibold text-gray-500 shadow-sm hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-green-600)]"
                    >
                        {showAll ? TESTIMONIALS_MESSAGES.SHOW_LESS : TESTIMONIALS_MESSAGES.SHOW_MORE}
                    </button>
                </div>
            )}
        </div>
    );
});

TestimonialsSection.displayName = 'TestimonialsSection';

export default TestimonialsSection;

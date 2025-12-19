import React from 'react';
import type { Testimonial } from '../../hooks/useTestimonials';

interface TestimonialCardProps {
    testimonial: Testimonial;
}

/**
 * Componente individual para mostrar un testimonio
 * Memoizado para evitar re-renders innecesarios
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(({ testimonial }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">"{testimonial.description}"</p>
            <p className="mt-4 text-right font-semibold text-gray-800">- {testimonial.name}</p>
        </div>
    );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;

import React from 'react';

export interface Testimonial {
    id: string;
    _id?: string;
    name: string;
    description: string;
    role?: string;
}

interface TestimonialCardProps {
    testimonial: Testimonial;
}

/**
 * Card minimalista para carrusel horizontal
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(({ testimonial }) => {
    return (
        <div className="flex-shrink-0 w-[300px] md:w-[350px] bg-white border border-gray-100 rounded-2xl p-6 mx-3 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col h-full">
                {/* Estrellas decorativas sutiles */}
                <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 flex-grow italic">
                    "{testimonial.description}"
                </p>

                <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {testimonial.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">{testimonial.name}</h4>
                        {testimonial.role && (
                            <p className="text-[10px] text-gray-400 font-medium">{testimonial.role}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;

import React from 'react';
import { useTestimonials } from '../../hooks/useTestimonials';
import TestimonialCard from './TestimonialCard';

/**
 * Sección de testimonios con carrusel minimalista e infinito
 * Optimizado para mensajes cortos y escalabilidad
 */
export const TestimonialsSection: React.FC = React.memo(() => {
    const {
        testimonials,
        loading,
        error,
    } = useTestimonials();

    // Duplicamos los testimonios para el efecto de scroll infinito sin saltos
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="bg-white py-16 sm:py-24 overflow-hidden border-t border-gray-50 min-h-[400px]">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">
                        Testimonios
                    </h2>
                    <p className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight">
                        Lo que dicen nuestras alumnas
                    </p>
                </div>

                <div className="relative mt-10">
                    {loading ? (
                        <div className="flex gap-6 animate-pulse overflow-hidden">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="min-w-[300px] h-48 bg-gray-100 rounded-2xl"></div>
                            ))}
                        </div>
                    ) : error || testimonials.length === 0 ? (
                        null
                    ) : (
                        <>
                            {/* Gradientes laterales para suavizar el flujo */}
                            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

                            <div className="flex overflow-hidden group">
                                <div className="animate-infinite-scroll">
                                    {duplicatedTestimonials.map((testimonial, index) => (
                                        <TestimonialCard 
                                            key={`${testimonial.id}-${index}`} 
                                            testimonial={testimonial} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {!loading && !error && testimonials.length > 0 && (
                    <div className="mt-12 text-center">
                        <p className="text-xs text-gray-400 font-medium tracking-wide">
                            PODÉS HACER CLICK EN UNA CARD PARA PAUSAR • MÁS DE 500 EXPERIENCIAS REALES
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
});

TestimonialsSection.displayName = 'TestimonialsSection';

export default TestimonialsSection;

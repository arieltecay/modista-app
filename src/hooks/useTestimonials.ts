import { useState, useEffect } from 'react';
import { getTestimonials } from '../services/testimonials/testimonialsServices';
import { TESTIMONIALS_CONFIG } from '../constants/testimonials.constants';

export interface Testimonial {
    id: string | number;
    name: string;
    description: string;
}

interface UseTestimonialsReturn {
    testimonials: Testimonial[];
    visibleTestimonials: Testimonial[];
    loading: boolean;
    error: Error | null;
    showAll: boolean;
    toggleShowAll: () => void;
}

/**
 * Hook personalizado para manejar la lógica de testimonios
 * Encapsula: fetch de datos, estado, paginación
 */
export const useTestimonials = (): UseTestimonialsReturn => {
    const [showAll, setShowAll] = useState(false);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch testimonials on mount
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getTestimonials();
                setTestimonials(data as Testimonial[]);
                setLoading(false);
            } catch (err) {
                setError(err as Error);
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    // Update visible testimonials when showAll or testimonials change
    useEffect(() => {
        if (showAll) {
            setVisibleTestimonials(testimonials);
        } else {
            setVisibleTestimonials(testimonials.slice(0, TESTIMONIALS_CONFIG.INITIAL_COUNT));
        }
    }, [showAll, testimonials]);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return {
        testimonials,
        visibleTestimonials,
        loading,
        error,
        showAll,
        toggleShowAll,
    };
};

import React from 'react';
import { HomeCarousel } from '../../components/HomeCarousel/HomeCarousel';
import TestimonialsSection from '../../components/TestimonialsSection';

/**
 * Página principal Home
 * Orquesta los componentes principales sin lógica de negocio
 */
const Home: React.FC = () => {
    return (
        <div className="relative bg-white">
            <HomeCarousel />
            <TestimonialsSection />
        </div>
    );
};

export default Home;

import React from 'react';
import { HomeCarousel } from '../../components/HomeCarousel/HomeCarousel';
import { Announcement } from '@/components';
import TestimonialsSection from '../../components/TestimonialsSection';

/**
 * Página principal Home
 * Orquesta los componentes principales sin lógica de negocio
 */
const Home: React.FC = () => {
    return (
        <div className="relative bg-white">
            <HomeCarousel />
            <Announcement />
            <TestimonialsSection />
        </div>
    );
};

export default Home;

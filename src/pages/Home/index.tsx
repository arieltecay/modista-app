import React from 'react';
import HomeSection from '../../components/HomeSection';
import { Announcement } from '@/components';
import TestimonialsSection from '../../components/TestimonialsSection';

/**
 * Página principal Home
 * Orquesta los componentes principales sin lógica de negocio
 */
const Home: React.FC = () => {
    return (
        <div className="relative bg-white">
            <div className="ml-4 mr-4 mt-4 mb-2">
                <HomeSection />
            </div>
            <Announcement />
            <TestimonialsSection />
        </div>
    );
};

export default Home;

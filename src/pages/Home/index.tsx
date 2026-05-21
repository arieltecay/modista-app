import React from 'react';
import { StaticBanner } from '../../components';
import TestimonialsSection from '../../components/TestimonialsSection';

/**
 * Página principal Home
 * Orquesta los componentes principales sin lógica de negocio
 */
const Home: React.FC = () => {
    return (
        <div className="relative bg-background">
            <StaticBanner />
            <TestimonialsSection />
        </div>
    );
};

export default Home;

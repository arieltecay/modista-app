import React from 'react';
import { StaticBanner, SEO } from '../../components';
import TestimonialsSection from '../../components/TestimonialsSection';

/**
 * Página principal Home
 * Orquesta los componentes principales sin lógica de negocio
 */
const Home: React.FC = () => {
    return (
        <div className="relative bg-background">
            <SEO 
                title="Academia de Costura y Diseño"
                description="Aprende costura desde cero con Mica Guevara. Cursos presenciales y online de alta costura, moldería y diseño de moda."
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "Modista App",
                    "image": "https://res.cloudinary.com/ddfee9hht/image/upload/v1775245847/modista_app/HomeMica.jpg",
                    "url": "https://modista-app.com",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Tucumán",
                        "addressCountry": "AR"
                    },
                    "description": "Academia de costura y diseño de alta costura."
                }}
            />
            <StaticBanner />
            <TestimonialsSection />
        </div>
    );
};

export default Home;

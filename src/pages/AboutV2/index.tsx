import React from 'react';
import V2Layout from '../../components/V2Layout';
import About from '../About';

/**
 * Sobre Mí v2: contenido completo del About vigente, envuelto en el layout
 * del nuevo sistema visual (navbar + footer atelier).
 */
const AboutV2: React.FC = () => (
  <V2Layout>
    <About />
  </V2Layout>
);

export default AboutV2;

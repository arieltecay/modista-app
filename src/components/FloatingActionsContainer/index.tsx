import React from 'react';
import { useLocation } from 'react-router-dom';
import WhatsAppFloatingButton from '../WhatsAppFloatingButton';
import ShareButton from './ShareButton';

/**
 * FloatingActionsContainer
 * Orquestador global para botones de acción flotantes.
 * Gestiona la disposición responsiva:
 * - Mobile: Stack vertical.
 * - Desktop: Stack horizontal.
 */
const FloatingActionsContainer: React.FC = () => {
  const location = useLocation();
  
  // Lógica de visibilidad inteligente para el botón de compartir
  // Solo se muestra en el detalle de un curso específico
  const isCourseDetailPage = /^\/cursos\/[^/]+$/.test(location.pathname);

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col-reverse md:flex-row items-start md:items-end gap-4 pointer-events-none">
      <div className="pointer-events-auto">
        <WhatsAppFloatingButton />
      </div>
      
      {isCourseDetailPage && (
        <div className="pointer-events-auto">
          <ShareButton />
        </div>
      )}
    </div>
  );
};

export default FloatingActionsContainer;

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { trackContactClick } from '../../services/analytics';
import { whatsappNumber } from '../../utils/constants';

/**
 * WhatsAppFloatingButton
 * Botón flotante posicionado en la parte inferior izquierda.
 * Proporciona una forma rápida y visible de contactar al soporte/ventas.
 */
const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMainClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      trackContactClick('whatsapp', 'Global Floating Button');
    }
  };

  const handleOptionClick = (option: string) => {
    const message = encodeURIComponent(`Hola Mica! Tengo una consulta sobre: ${option}`);
    window.open(`${whatsappNumber}?text=${message}`, '_blank');
    trackContactClick('whatsapp', `Option: ${option}`);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-3">
      {/* Menú de opciones rápidas */}
      {isOpen && (
        <div className="flex flex-col gap-2 mb-2 animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => handleOptionClick('Cursos Online')}
            className="bg-white px-4 py-2 rounded-lg shadow-lg border border-indigo-100 text-sm font-semibold text-gray-700 hover:bg-indigo-50 transition-all text-left"
          >
            📚 Duda sobre Cursos
          </button>
          <button
            onClick={() => handleOptionClick('Talleres Presenciales')}
            className="bg-white px-4 py-2 rounded-lg shadow-lg border border-indigo-100 text-sm font-semibold text-gray-700 hover:bg-indigo-50 transition-all text-left"
          >
            📍 Talleres en Tucumán
          </button>
          <button
            onClick={() => handleOptionClick('Consulta General')}
            className="bg-white px-4 py-2 rounded-lg shadow-lg border border-indigo-100 text-sm font-semibold text-gray-700 hover:bg-indigo-50 transition-all text-left"
          >
            🧵 Consulta de Costura
          </button>
        </div>
      )}

      {/* Botón Principal */}
      <button
        onClick={handleMainClick}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300
          ${isOpen ? 'bg-indigo-600 rotate-90' : 'bg-green-500 hover:bg-green-600 hover:scale-110'}
          text-white focus:outline-none focus:ring-4 focus:ring-green-300
        `}
        aria-label="Contactar por WhatsApp"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <FaWhatsapp className="w-8 h-8" />
        )}
        
        {/* Notificación visual para llamar la atención (solo si no se ha abierto) */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default WhatsAppFloatingButton;

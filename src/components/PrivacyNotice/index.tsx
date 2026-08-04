import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

/**
 * PrivacyNotice
 * Componente reutilizable para mostrar el compromiso de privacidad y ética de datos.
 * Diseñado para integrarse en el pie de página de landings o formularios.
 */
const PrivacyNotice: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-6 px-4">
      <div className="bg-white border border-[#7d8c7b]/20 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Columna 1: Aviso Legal */}
          <div className="flex-1 flex gap-3">
            <div className="mt-1 bg-[#7d8c7b]/10 p-1.5 rounded-lg flex-shrink-0">
              <ShieldCheckIcon className="w-5 h-5 text-[#516050]" />
            </div>
            <div>
              <h4 className="text-[#141b2b] font-semibold text-sm mb-1 uppercase tracking-wider">
                Aviso de Privacidad
              </h4>
              <p className="text-[#747872] text-xs leading-relaxed">
                Tus datos son utilizados exclusivamente para mejorar tu experiencia y medir el rendimiento de nuestra academia. 
                Consulta nuestra <Link to="/privacidad" className="text-[#516050] hover:text-[#4A5A4B] underline underline-offset-4">Política de Privacidad</Link> completa.
              </p>
            </div>
          </div>

          {/* Divisor en desktop */}
          <div className="hidden md:block w-px h-14 bg-[#7d8c7b]/20 self-center" />

          {/* Columna 2: Uso Ético */}
          <div className="flex-1 flex gap-3">
            <div className="mt-1 bg-[#7d8c7b]/10 p-1.5 rounded-lg flex-shrink-0">
              <LockClosedIcon className="w-5 h-5 text-[#516050]" />
            </div>
            <div>
              <h4 className="text-[#141b2b] font-semibold text-sm mb-1 uppercase tracking-wider">
                Uso Ético de Datos
              </h4>
              <p className="text-[#747872] text-xs leading-relaxed">
                Almacenamos tu información de forma segura en bases de datos privadas. 
                Solo el administrador tiene acceso y <strong>nunca vendemos tus datos a terceros</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Badge de seguridad */}
        <div className="mt-5 pt-5 border-t border-[#7d8c7b]/20 flex justify-center items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#516050] animate-pulse" />
          <span className="text-[10px] font-bold text-[#747872] uppercase tracking-[0.2em]">
            Conexión Segura SSL Encryptada
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;

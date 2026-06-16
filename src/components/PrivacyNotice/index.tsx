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
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8 px-4">
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Columna 1: Aviso Legal */}
          <div className="flex-1 flex gap-4">
            <div className="mt-1 bg-violet-500/10 p-2 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">
                Aviso de Privacidad
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Tus datos son utilizados exclusivamente para mejorar tu experiencia y medir el rendimiento de nuestra academia. 
                Consulta nuestra <Link to="/privacidad" className="text-violet-400 hover:text-violet-300 underline underline-offset-4">Política de Privacidad</Link> completa.
              </p>
            </div>
          </div>

          {/* Divisor en desktop */}
          <div className="hidden md:block w-px h-16 bg-gray-800 self-center" />

          {/* Columna 2: Uso Ético */}
          <div className="flex-1 flex gap-4">
            <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg">
              <LockClosedIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">
                Uso Ético de Datos
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Almacenamos tu información de forma segura en bases de datos privadas. 
                Solo el administrador tiene acceso y <strong>nunca vendemos tus datos a terceros</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Badge de seguridad */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex justify-center items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            Conexión Segura SSL Encryptada
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;

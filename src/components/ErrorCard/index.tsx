import React from 'react';
import { ErrorCardProps } from './types';

const ErrorCard: React.FC<ErrorCardProps> = ({ 
  title = "No se pudieron cargar los cursos", 
  message, 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
      <div className="flex flex-col items-center gap-4">
        {/* Icono/Ilustración simple */}
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{message ?? "Hubo un problema al obtener los cursos. Revisa tu conexión o intenta nuevamente."}</p>

        <div className="flex gap-3">
          {showRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-[var(--color-green-600)] text-white font-medium rounded-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-green-600)] focus:ring-opacity-60 transition"
              aria-label="Reintentar carga de cursos"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;

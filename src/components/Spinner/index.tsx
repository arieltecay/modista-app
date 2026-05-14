import React from 'react';
import { GiSewingString } from "react-icons/gi";
import { SpinnerProps } from './types';

const Spinner: React.FC<SpinnerProps> = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center py-10" role="status">
      <div className="relative">
        <GiSewingString 
          className="h-20 w-20 text-[var(--color-green-600)] animate-pulse" 
          aria-hidden="true" 
        />
        <div className="absolute inset-0 h-20 w-20 border-4 border-dashed border-[var(--color-green-600)]/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
      </div>
      {text && (
        <p className="mt-6 text-lg font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      )}
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default Spinner;

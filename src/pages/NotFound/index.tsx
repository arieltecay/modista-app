import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-4">Página No Encontrada</h2>
      <p className="text-gray-500 mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[var(--color-green-600)] text-white rounded-lg hover:bg-[var(--color-green-800)] transition-colors duration-300"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Se obtiene la clave pública de Mercado Pago desde las variables de entorno de Vite.
const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

function CourseCard({ course }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyClick = async () => {
    setIsLoading(true);
    try {
      // 1. Llama a tu backend para crear la preferencia de pago
      const response = await fetch('http://localhost:3001/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: course.id,
          title: course.title,
          price: course.price,
        }),
      });

      const preference = await response.json();

      if (preference.id) {
        // 2. Si se crea la preferencia, inicializa el checkout de Mercado Pago
        const mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY);

        // 3. Redirige al usuario al checkout
        mp.checkout({
          preference: {
            id: preference.id,
          },
        });
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Ocurrió un error al intentar procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <div className="flex-grow">
        <Link to={`/cursos/${course.id}`}>
          <img src={course.imageUrl} alt={`Imagen de ${course.title}`} className="w-full h-48 object-contain" />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-base">{course.shortDescription}</p>
          </div>
        </Link>
      </div>

      {/* Sección de compra */}
      <div className="px-6 pt-4 pb-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-2xl font-bold text-purple-600">${course.price}</p>
        <button
          onClick={handleBuyClick}
          disabled={isLoading}
          className="bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition-all duration-300 disabled:bg-purple-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Procesando...' : 'Comprar ahora'}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;

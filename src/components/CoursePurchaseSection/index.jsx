import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const CoursePurchaseSection = ({ course }) => {
  const isFree = parseFloat(course.price) === 0;

  if (isFree) {
    return null; // No renderiza nada si el curso es gratuito
  }

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <a
              href="https://wa.me/3813508796"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition duration-300 shadow-lg"
            >
              <FaWhatsapp className="mr-2" /> Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursePurchaseSection;

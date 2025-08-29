import React from 'react';

const Announcement = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            ¡Inscripciones Abiertas!
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Da el primer paso hacia tu futuro en la moda. Ya están abiertas las inscripciones para nuestro nuevo curso de Diseño de Indumentaria. ¡No te quedes fuera!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/inscriptions"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Saber más
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;

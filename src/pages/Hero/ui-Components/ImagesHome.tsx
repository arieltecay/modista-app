import React from 'react';

const ImagesHome = () => {
  return (
    <div className="mx-auto mt-8 w-full sm:mt-16 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex lg:flex-none xl:ml-32 lg:w-1/2">
      <div className="w-full">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          <div className="relative h-64 overflow-hidden rounded-xl sm:h-96 lg:h-full">
            <img
              src="/images/maniqui.jpeg"
              alt="Modista trabajando"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative h-64 overflow-hidden rounded-xl">
              <img
                src='/images/caricatura.jpeg'
                alt="Diseño de moda"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative h-64 overflow-hidden rounded-xl">
              <img
                src="/images/pantalon.jpeg"
                alt="Taller de costura"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesHome;
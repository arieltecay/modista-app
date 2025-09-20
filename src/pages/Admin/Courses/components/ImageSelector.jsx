import React from 'react';

/**
 * Componente para seleccionar imágenes existentes de la carpeta public/images
 * @param {string} selectedImage - La imagen actualmente seleccionada
 * @param {function} onImageSelect - Función callback cuando se selecciona una imagen
 */
const ImageSelector = ({ selectedImage, onImageSelect }) => {
  // Lista de imágenes disponibles en public/images
  const availableImages = [
    'caricatura.jpeg',
    'chica.jpeg',
    'costuraMujer.jpeg',
    'hilos.jpeg',
    'maniqui.jpeg',
    'moda.jpg',
    'molde.jpeg',
    'pantalon.jpeg',
    'perfil.jpg',
    'persona.jpeg',
    'ventana.jpeg'
  ];

  const handleImageClick = (imageName) => {
    const imageUrl = `/images/${imageName}`;
    onImageSelect(imageUrl);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Selecciona una imagen para el curso:
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-80 overflow-y-auto">
        {availableImages.map((imageName) => {
          const imageUrl = `/images/${imageName}`;
          const isSelected = selectedImage === imageUrl;

          return (
            <div
              key={imageName}
              onClick={() => handleImageClick(imageName)}
              className={`
                cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 hover:shadow-md
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="aspect-square overflow-hidden rounded-md mb-2">
                <img
                  src={imageUrl}
                  alt={imageName.replace('.jpeg', '').replace('.jpg', '')}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-center text-gray-600 truncate">
                {imageName.replace('.jpeg', '').replace('.jpg', '')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Preview de imagen seleccionada */}
      {selectedImage && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Imagen seleccionada:</h4>
          <div className="flex items-center space-x-4">
            <img
              src={selectedImage}
              alt="Imagen seleccionada"
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
            <div className="text-sm text-gray-600">
              <p><strong>URL:</strong> {selectedImage}</p>
              <p><strong>Archivo:</strong> {selectedImage.split('/').pop()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
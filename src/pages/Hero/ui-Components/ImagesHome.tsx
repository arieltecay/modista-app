// Component that displays hero section with profile image and text content
export const ImagesHome = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-50 to-purple-50">
      {/* Background image */}
      <img
        src="/images/HomeMica.jpeg"
        alt="Fondo decorativo"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      {/* Content overlay */}
      <div className="relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left side - Profile image */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-1">
              <div className="relative">
                <img
                  src="/images/perfil.jpg"
                  alt="Mica Guevara - Modista de alta costura"
                  className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full object-cover shadow-2xl border-4 border-white"
                />
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 order-2 lg:order-2">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  APRENDE MOLDERÍA Y CONFECCIÓN
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700 mt-2">
                  PASO A PASO
                </h2>
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Te enseñaré a patronar y coser usando técnicas sencillas para que aprendas a hacer tus propios diseños o puedas emprender.
              </p>

              <div className="space-y-1 sm:space-y-2">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Mica Guevara
                </p>
                <p className="text-base sm:text-lg text-gray-600">
                  modista de alta costura
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesHome;

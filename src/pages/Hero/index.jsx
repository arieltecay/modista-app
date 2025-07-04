import image from '../../assets/images/moda.jpg'

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" />
      </svg>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:pb-24 sm:pt-10 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8 lg:w-1/2">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-purple-600/10 px-3 py-1 text-sm font-semibold leading-6 text-purple-600 ring-1 ring-inset ring-purple-600/10">
                Últimas noticias
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>Nuevos cursos disponibles</span>
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Conviértete en una Modista Profesional
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Aprende las técnicas más avanzadas de costura y diseño de moda. Domina el arte de la confección y crea tus propias colecciones.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="#courses"
              className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              Ver Cursos
            </a>
            <a href="#about" className="text-sm font-semibold leading-6 text-gray-900">
              Sobre Mí <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-8 w-full sm:mt-16 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex lg:flex-none xl:ml-32 lg:w-1/2">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-xl sm:h-96 lg:h-full">
                <img
                  src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
                  alt="Modista trabajando"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <img
                    src={image}
                    alt="Diseño de moda"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
                    alt="Taller de costura"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
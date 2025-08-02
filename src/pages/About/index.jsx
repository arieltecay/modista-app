import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img src="/images/perfil.jpg" alt="Sobre Mí" className="rounded-lg shadow-lg mx-auto w-80 h-auto w-70 h-auto" />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sobre Mí 🧵</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Curabitur sit amet est sed felis dignissim tincidunt.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Praesent eu libero et diam aliquam efficitur. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="bg-white min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">Términos y Condiciones</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al utilizar el bot de WhatsApp de Modista App y acceder a nuestro sitio web, aceptas quedar vinculado por estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Descripción del Servicio</h2>
            <p>
              Modista App ofrece un asistente virtual para la gestión de turnos de modistería, inscripciones a cursos de costura y soporte al cliente. Los servicios son prestados por Micaela Guevara.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Uso del Bot de WhatsApp</h2>
            <p>
              El usuario se compromete a utilizar el bot de manera lícita. Queda prohibido el envío de contenido ofensivo, spam o cualquier uso que interfiera con el correcto funcionamiento del servicio. Nos reservamos el derecho de bloquear el acceso a cualquier usuario que viole estas normas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Pagos e Inscripciones</h2>
            <p>
              Las inscripciones a cursos se confirman mediante el envío del comprobante de pago. Los precios y tarifas están sujetos a cambios, los cuales serán informados a través del tarifario oficial en el sitio web o mediante el bot.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Propiedad Intelectual</h2>
            <p>
              Todo el contenido compartido en los cursos, incluyendo videos, patrones y materiales didácticos, es propiedad intelectual de Micaela Guevara. Está prohibida su reproducción, distribución o venta sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Limitación de Responsabilidad</h2>
            <p>
              Modista App no se hace responsable por interrupciones técnicas en el servicio de WhatsApp o fallas externas de conectividad que impidan el uso del bot en momentos específicos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Contacto</h2>
            <p>
              Para cualquier duda relacionada con estos términos, puedes contactarnos a través de:
            </p>
            <p className="font-semibold mt-2 text-gray-800">modistaapp@gmail.com</p>
          </section>

          <footer className="pt-8 text-sm text-gray-400">
            Última actualización: 28 de abril de 2026
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;

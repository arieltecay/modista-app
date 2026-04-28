import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">Política de Privacidad</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introducción</h2>
            <p>
              En Modista App, propiedad de Micaela Guevara, nos tomamos muy en serio tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal cuando interactúas con nuestro bot de WhatsApp y nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Información que recopilamos</h2>
            <p>Recopilamos la siguiente información necesaria para brindarte nuestro servicio:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Nombre y Apellido.</li>
              <li>Número de teléfono (a través de la interacción con WhatsApp).</li>
              <li>Información sobre inscripciones a cursos y turnos solicitados.</li>
              <li>Comprobantes de pago enviados voluntariamente por el usuario.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Finalidad del tratamiento</h2>
            <p>Tus datos son utilizados exclusivamente para:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Gestionar tus inscripciones a cursos y talleres.</li>
              <li>Coordinar turnos de modistería.</li>
              <li>Enviar notificaciones sobre el estado de tus pagos o cambios en el servicio.</li>
              <li>Responder a tus consultas de manera personalizada.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas para proteger tu información. No compartimos tus datos personales con terceros con fines comerciales. Los datos solo se procesan a través de las herramientas oficiales de Meta (WhatsApp Business API) para la comunicación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Eliminación de datos</h2>
            <p>
              Meta requiere que proporcionemos instrucciones claras para que los usuarios soliciten la eliminación de sus datos. Si deseas que eliminemos tu información de nuestra base de datos, por favor envía un correo electrónico a:
            </p>
            <p className="font-semibold mt-2 text-gray-800">modistaapp@gmail.com</p>
            <p className="mt-2">
              Una vez recibida la solicitud, procederemos a borrar tu historial de interacciones y datos personales en un plazo máximo de 72 horas hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Cambios en la política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Te recomendamos revisar esta página periódicamente para estar al tanto de cualquier cambio.
            </p>
          </section>

          <footer className="pt-8 text-sm text-gray-400">
            Última actualización: 28 de abril de 2026
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

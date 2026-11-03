const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background min-h-screen py-20 transition-colors duration-250">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 border-b border-border pb-4">Política de Privacidad</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introducción</h2>
            <p>
              En Modista App, propiedad de Micaela Guevara, nos tomamos muy en serio tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal cuando interactúas con nuestro sitio web, nuestros cursos y nuestro bot de WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Información que recopilamos</h2>
            <p>Recopilamos la siguiente información necesaria para brindarte nuestro servicio:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Nombre y Apellido.</li>
              <li>Correo electrónico y número de teléfono que proporcionas al inscribirte o al comunicarte por WhatsApp.</li>
              <li>Información sobre inscripciones a cursos y turnos solicitados.</li>
              <li>Comprobantes de pago enviados voluntariamente por el usuario.</li>
              <li>Datos técnicos y de navegación, como páginas visitadas, interacciones con formularios, dirección IP, navegador e identificadores de cookies o del navegador.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Finalidad del tratamiento</h2>
            <p>Tus datos son utilizados exclusivamente para:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Gestionar tus inscripciones a cursos y talleres.</li>
              <li>Coordinar turnos de modistería.</li>
              <li>Enviar notificaciones sobre el estado de tus pagos o cambios en el servicio.</li>
              <li>Responder a tus consultas de manera personalizada.</li>
              <li>Medir las visitas y conversiones de nuestras campañas publicitarias y mejorar su rendimiento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Medición publicitaria con Meta</h2>
            <p>
              En nuestro sitio usamos Meta Pixel y Conversions API para medir visitas y conversiones, atribuir resultados a campañas y mejorar el rendimiento de nuestros anuncios. Para estos fines, podemos enviar a Meta Platforms información sobre eventos del sitio, como visitas a páginas de cursos, inicio o envío de formularios e inscripciones o compras.
            </p>
            <p>
              Estas señales pueden incluir dirección IP, información del navegador, identificadores de clic o cookies de Meta y un identificador seudónimo que guardamos en el navegador. Ese identificador puede permanecer allí hasta que borres los datos del sitio desde tu navegador. Cuando corresponde, también enviamos datos como correo electrónico, teléfono, nombre, ciudad o país en formato hash SHA-256 para ayudar a relacionar eventos. El hash reduce la exposición del dato legible, pero no significa que sea anónimo.
            </p>
            <p>
              Meta recibe estos datos y los procesa conforme a sus propias condiciones y políticas. Puedes consultar la <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer" className="underline">Política de privacidad de Meta</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas para proteger tu información y limitar el acceso a quienes la necesitan para brindar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Derechos y eliminación de datos</h2>
            <p>
              Puedes solicitar acceso, actualización o eliminación de tus datos personales, y consultar cómo ejercer tus derechos, escribiendo a:
            </p>
            <p className="font-semibold mt-2 text-foreground">modistaapp@gmail.com</p>
            <p className="mt-2">
              Para solicitudes de eliminación relacionadas con aplicaciones o servicios de Meta, también puedes escribirnos a esa dirección. Revisaremos cada solicitud y te informaremos el resultado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cambios en la política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Te recomendamos revisar esta página periódicamente para estar al tanto de cualquier cambio.
            </p>
          </section>

          <footer className="pt-8 text-sm text-muted-foreground/60">
            Última actualización: 28 de abril de 2026
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background min-h-screen py-20 transition-colors duration-250">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 border-b border-border pb-4">Política de Privacidad</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introducción</h2>
            <p>
              Modista App, a cargo de Micaela Guevara, trata tus datos para prestar sus servicios y, solo si lo aceptas, para medir y mejorar la publicidad. Esta política explica qué información usamos, con qué fines, con quién puede compartirse y cómo ejercer tus derechos. Para consultas de privacidad puedes escribir a <a href="mailto:modistaapp@gmail.com" className="underline">modistaapp@gmail.com</a>.
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
              <li>Datos técnicos y de navegación, como páginas visitadas, interacciones con formularios, dirección IP, navegador, origen de la visita e identificadores de cookies o del navegador.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Finalidad del tratamiento</h2>
            <p>Usamos tus datos para:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Gestionar tus inscripciones a cursos y talleres.</li>
              <li>Coordinar turnos de modistería.</li>
              <li>Enviar notificaciones sobre el estado de tus pagos o cambios en el servicio.</li>
              <li>Responder a tus consultas de manera personalizada.</li>
              <li>Con tu consentimiento opcional, medir visitas y conversiones y evaluar el rendimiento de nuestras campañas publicitarias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Medición opcional y consentimiento</h2>
            <p>
              Las herramientas opcionales de medición y publicidad no se cargan hasta que eliges “Aceptar medición y publicidad” en el aviso de privacidad. Si eliges “Solo necesarias”, puedes navegar, inscribirte y pagar; esas herramientas permanecen desactivadas. Puedes cambiar o revocar tu elección desde “Preferencias de privacidad”, disponible en el sitio.
            </p>
            <p>
              Si aceptas, podemos cargar Google Tag Manager, Meta Pixel, Meta Conversions API y Microsoft Clarity. El contenedor de Google Tag Manager puede activar otras etiquetas configuradas para el sitio; su inventario debe mantenerse actualizado. Estas herramientas pueden recibir eventos como visitas a páginas, visualización de cursos, inicio de formularios, inscripciones y compras, además de la URL o referencia de la página, dirección IP, navegador, tipo de dispositivo, parámetros de campaña, identificadores de clic o cookies y un identificador aleatorio seudónimo del navegador.
            </p>
            <p>
              Cuando se registra una inscripción o compra y aceptaste la medición, también podemos enviar a Meta datos de contacto disponibles, como correo, teléfono, nombre, apellido, ciudad o país. La Conversions API transforma esos campos y el identificador seudónimo mediante SHA-256 antes de enviarlos; los identificadores de cookies y ciertos datos técnicos pueden enviarse en su formato correspondiente. El hash es una seudonimización y no vuelve anónimos los datos.
            </p>
            <p>
              Meta, Google y Microsoft procesan la información que reciben según sus propias políticas y pueden tratarla fuera de Argentina. Consulta la <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer" className="underline">Política de privacidad de Meta</a>, la <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline">Política de privacidad de Google</a> y la <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noreferrer" className="underline">Declaración de privacidad de Microsoft</a>.
            </p>
            <p>
              La elección se registra junto con un identificador seudónimo por un máximo de 12 meses; pasado ese plazo volvemos a pedirla. Si revocas el consentimiento, detenemos la carga y el envío futuro de señales, borramos identificadores conocidos de Meta, Google y Clarity del navegador y eliminamos los registros de navegación y payloads CAPI que podemos asociar a ese identificador. Algunas etiquetas de terceros pueden usar otras cookies; puedes administrarlas desde la configuración del navegador y los controles del proveedor. La revocación no afecta tratamientos realizados antes de ella ni permite retirar un envío que ya estaba en curso; tampoco elimina automáticamente información que Meta u otros proveedores recibieron.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Proveedores y conservación</h2>
            <p>
              Para operar el servicio podemos compartir los datos necesarios con proveedores de alojamiento, comunicaciones, pagos, analítica y publicidad. Limitamos la información a la finalidad correspondiente. Conservamos los datos durante el tiempo necesario para prestar el servicio, atender obligaciones legales y resolver reclamos; los identificadores publicitarios se dejan de usar cuando revocas el consentimiento y se eliminan de nuestros registros asociados cuando es técnicamente posible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas para proteger tu información y limitar el acceso a quienes la necesitan para brindar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Derechos y eliminación de datos</h2>
            <p>
              Puedes solicitar acceso, actualización o eliminación de tus datos personales, y consultar cómo ejercer tus derechos, escribiendo a:
            </p>
            <p className="font-semibold mt-2 text-foreground">modistaapp@gmail.com</p>
            <p className="mt-2">
              Puedes solicitar acceso, rectificación, actualización o supresión de tus datos conforme a la normativa aplicable. También puedes presentar un reclamo ante la Agencia de Acceso a la Información Pública (AAIP), autoridad de control en Argentina. La revocación del consentimiento no tiene efecto retroactivo. La información ya recibida por terceros se gestiona además mediante sus propios canales.
            </p>
            <p className="mt-2">Más información sobre tus derechos está disponible en la <a href="https://www.argentina.gob.ar/aaip/datospersonales/derechos" target="_blank" rel="noreferrer" className="underline">guía de derechos de la AAIP</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Cambios en la política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Te recomendamos revisar esta página periódicamente para estar al tanto de cualquier cambio.
            </p>
          </section>

          <footer className="pt-8 text-sm text-muted-foreground/60">
            Última actualización: 3 de noviembre de 2026
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

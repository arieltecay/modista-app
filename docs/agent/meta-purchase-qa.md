# Purchase de Meta: diagnóstico y pruebas

El aviso de Purchase del píxel motivó la revisión del 19/11/2026. En hora argentina, producción registró cuatro pagos completos. Tres inscripciones no tenían consentimiento de marketing registrado y se omitieron correctamente. A las 14:50 se entregó el único Purchase con consentimiento por CAPI. Meta mostró un Purchase de servidor entre las 14:00 y las 15:00. Lead e InitiateCheckout de esa inscripción tuvieron invocación del píxel y entrega CAPI con IDs emparejados. Para Purchase no hubo registro de invocación del píxel ni de retorno en el embudo. Se desconoce si la persona volvió desde Mercado Pago. La visita se clasificó como directa y no tenía `fbc`.

## Qué cambió

- `PaymentSuccess.tsx` mantiene el chequeo de pago confirmado, intenta el seguimiento cuando hay consentimiento y lo vuelve a intentar al recibir `META_PIXEL_READY_EVENT`. El listener se retira al salir de la pantalla o al cambiar sus dependencias.
- `analytics.ts` distingue las marcas de GTM y del píxel. La marca del píxel se guarda después de invocar `fbq`; una invocación confirma que se llamó al píxel, no que Meta recibió el evento. Se conserva la marca anterior para evitar reenvíos durante la transición.
- El navegador y la API conservan `purchase_<id de inscripción>`. El backend puede entregar la señal aunque la persona no vuelva de Mercado Pago. Mantener el consentimiento y el mismo identificador en los dos canales.
- El aviso de Axiom «CAPI Purchase no persistido» mezcla omisión por consentimiento y fallo de persistencia. Separar esos motivos requiere un cambio posterior en la API.

## Evidencia y reproducción

1. La prueba en `src/services/analytics.test.ts` falló antes del fix: Purchase se perdía si el píxel se inicializaba tarde. Después pasa: una invocación con el ID esperado, un único evento GTM y respeto por la marca anterior.
2. Prueba de integración en Chrome con el build de la web y `modista_test_db`: se creó una inscripción y un consentimiento ficticios, se pasó un pago aprobado al procesador de webhook, se repitió el mismo pago y se abrió `/payment/success`. La página confirmó el pago, el historial quedó con una entrada y se capturó un Purchase por canal, con el mismo ID, valor y moneda. CAPI y el píxel se interceptaron localmente en esa prueba. No hubo cobro, correo real ni WhatsApp. Los datos de la corrida exitosa se retiraron al terminar.
3. Antes de repetir, comprobar que el nombre de la BD resuelta es `modista_test_db`. Usar una inscripción nueva y datos ficticios. Si se reutiliza `api/scripts/test-e2e-payment.mjs`, comprobar que el importe simulado cubre el precio y desactivar notificaciones externas. Usar `EMAIL_MODE=file`. El retorno real desde Mercado Pago queda fuera de esta simulación.
4. Para confirmar recepción en Meta, usar [Modista Web QA](https://eventsmanager.facebook.com/events_manager2/list/dataset/1863039975828354/test_events?business_id=2337886099827465&act=3546082282136341), ID `1863039975828354`. Se creó para esta prueba, separado del píxel de producción `912068635271914`. Usar el mismo ID QA en frontend y backend y obtener el código vigente en «Probar eventos». Guardar la credencial solo en el entorno local de la prueba. No reutilizar datos históricos de clientes.
5. El primer POST al conjunto QA con la credencial existente fue rechazado por Graph (`100/33`). Meta exigió un correo asociado al negocio antes de generar un token de integración directa. Tras la confirmación del correo, se generó el token sin Dataset Quality API y se usó solo en memoria en la prueba local.
6. El 20/11 a las 09:44:56 ART, Graph respondió `events_received: 1` al Purchase QA `purchase_6b00409105f23ca44d168ef6`; el outbox quedó `sent`. Chrome mostró «¡Pago confirmado!» al abrir el retorno de esa misma inscripción desde «Probar eventos». El resumen de QA mostraba un Purchase de navegador anterior, pero durante la revisión «Probar eventos» no mostró el par de esta corrida. Sigue pendiente confirmar la recepción del navegador para ese ID y su deduplicación en Meta. La cobertura de `fbc` requiere una prueba aparte a partir de un clic de Meta.

Meta indica que los eventos con `test_event_code` pueden utilizarse en medición y segmentación. Mantener las compras ficticias en QA y usar Modista Pixel v2 para observar compras reales posteriores al despliegue. [Documentación de Meta](https://developers.facebook.com/documentation/ads-commerce/conversions-api/using-the-api#testEvents).

## Revisión del cambio

[PR #12 de modista-app](https://github.com/arieltecay/modista-app/pull/12), rama `fix/meta-purchase-pixel-ready`, base `master`. Cubre la corrección del navegador, la regresión y esta guía. Para cerrarlo, distinguir la verificación local del estado de recepción y deduplicación en Meta QA. El despliegue en producción queda fuera de esta revisión.

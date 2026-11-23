# Contratos

- `/payment/success` consulta `accessNotifications` en `GET /api/payment/status/:inscriptionId`: afirma ambos envíos solo con dos `accepted`; si WhatsApp está `disabled`, dirige solo al correo. `unknown`, fallo o timeout mantienen texto neutral. Los retornos pending/failure confirmados redirigen a success. Evidencia: `src/pages/Payment/PaymentSuccess.tsx`.

- Adquisición (`src/utils/acquisition/`): envía a `POST /api/acquisition/{visits,events,signals/browser}` con los headers de consentimiento que ya inyecta `apiClient`. Solo corre con `VITE_ACQUISITION_TRACKING_ENABLED=true` (interruptor de rollback del cliente) y consentimiento vigente.
- Una visita (`modista_visit_context`, `sessionStorage`) se renueva tras 30 min sin actividad, a las 24 h, si cambia el visitante o si la URL trae un toque de campaña distinto. Dos pestañas = dos visitas con el mismo `visitorId` (`modista_session_id`).
- Eventos: solo los pasos de comportamiento (`page_view`, `course_detail_view`, `pricing_visible`, `cta_click`, `form_*`, `scroll_*`, `redirect_to_payment`). `lead`, `initiate_checkout` y `purchase` los crea el servidor. Evidencia: `src/utils/acquisition/funnel-steps.ts`.
- `trackFunnel` sigue enviando a `/api/funnel/event` durante la transición y además replica el paso al tracker de adquisición.
- `/factura/<token>` (token de 64 hex) muestra la factura de ARCA: `GET /api/invoices/public/:token` con `fetch` simple (sin sesión, cookies ni cabeceras de Meta; sin `Referer`). 404 = "no encontrada"; otro error ofrece reintentar. Evidencia: `src/services/invoice/invoiceService.ts`.

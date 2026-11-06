# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Visitantes públicos:** personas interesadas en la cultura coreana (aprendices del idioma, comunidad Hallyu/ARMY, viajeras, posibles voluntarias, aliados y patrocinadores). Navegan mayormente desde el celular; hay visitantes hispanohablantes y coreanohablantes. La navegación pública es abierta a todo público.
- **Representante legal:** actualiza contenido en el panel Payload (`/admin`) sin ayuda del desarrollador. No debe poder tocar usuarios, estructura técnica ni configuración.
- **Registros a eventos (fase 1):** solo para mayores de 18 años.

## Product Purpose

Sitio web institucional bilingüe (español/coreano) de BORAHAE, ESAL que promueve el intercambio cultural entre Colombia y Corea del Sur a través del Hallyu, la gastronomía, el idioma y la sociedad coreana. Debe: explicar con claridad quién es BORAHAE (misión inclusiva), dar visibilidad a programas (curso de coreano, becas, talleres), eventos y viajes (BORAHAE TRIP 2027, Seúl, 6–21 de junio, 25 personas), permitir inscripción gratuita a eventos y contacto, facilitar donaciones (PayPal/transferencia) y atraer patrocinio. Éxito: el representante mantiene el sitio solo y una visitante entiende qué es BORAHAE en segundos, se inscribe o escribe en menos de un minuto, en ambos idiomas.

## Positioning

Integrador cultural único: BORAHAE combina —en una sola entidad sin fines de lucro— lo que an ámbito vecino ofrece por separado: curso de coreano + viaje organizado a Seúl + eventos gratuitos + un enfoque explícito de inclusión e igualdad de condiciones. (Confirmado por el desarrollador, 6 nov 2026.)

## Operating Context

- Edita contenido desde Payload CMS (`/admin`) el representante legal; las colecciones `contact-submissions` y `event-registrations` son privadas (solo lectura autorizada, nunca API pública).
- El contenido vive en `es` (por defecto) y `ko`; el coreano hace fallback al español. Traducción coreana es asistida por IA y **requiere revisión humana antes de publicar** (legal, pagos y condiciones especialmente).
- `site-settings` administra interruptores de Galería, Patrocinio y WhatsApp (el CMS puede ocultarlos sin código).
- Los eventos admiten cupo opcional; antispam = honeypot + rate limit; correo transaccional con Resend (dominio del cliente pendiente de verificación).
- Hosting: Vercel (main=producción, dev/PR=preview), BD Neon (rama dev/preview, main/producción), archivos en Vercel Blob.
- Plazo de entrega: 10 días, desarrollador único.

## Capabilities and Constraints

- Fase 1: sin pagos integrados, sin área de miembros, sin inscripción formal a viajes, sin lista de espera.
- Eventos gratuitos, solo 18+: la edad se valida en servidor y no se persiste fecha de nacimiento.
- Secciones ocultables desde el CMS: Galería, Patrocinio, botón de WhatsApp.
- Rutas públicas fijas (slug en español también en `/ko`); legal incluye política de datos, términos y condiciones de viaje (esta solo si el cliente aprueba contenido).
- Datos personales bajo ley colombiana: mínimo de datos, consentimiento explícito con trazabilidad, registros nunca expuestos.
- Información legal de la organización (razón social, NIT, correo institucional, enlaces de redes, PayPal, logo, textos legales, fotos autorizadas): **pendientes del cliente** — usar marcadores `[PENDIENTE-CLIENTE]`, nunca inventarlos.

## Brand Commitments

- **Paleta de marca (derivada del logo oficial que el desarrollador recibió del cliente; el binario del logo aún no está en el proyecto):** superficie `#F7F1FB`, primario `#603C94`, secundario `#B58CDA` (solo decorativo — no pasa contraste para texto), hover `#4D2F78`, texto `#241832`. Es compromiso de marca, no orientativa.
- **Tipografía:** Noto Serif KR (títulos y frases destacadas), Noto Sans KR (texto, menús, formularios, botones), en ambos idiomas.
- **Tono:** minimalista, institucional y cultural; cálido, no facilitado fan-site. Español neutro de Colombia. **Coreano formal-cortés: [PENDIENTE-CLIENTE]** (quién confirma y cuándo).
- **Marca BTS/FESTA:** prohibido usar material de BTS/HYBE/FESTA sin confirmación escrita del cliente, con aviso de no afiliación oficial aprobado por el cliente.

## Evidence on Hand

- Especificaciones funcionales y técnicas v1.0 (en `docs/`), ROADMAP y PRODUCT acuerdos v1.0.
- Falta y no se debe fabricar: logo (formatos vectoriales), textos finales en español, fotografías autorizadas, textos legales aprobados, datos legales (NIT, razón social, correo institucional), enlaces de redes, PayPal, condiciones de viaje con precios.
- El sitio base (Next.js + Payload) está desplegado en preview y producción con CI en verde.

## Product Principles

1. **Accesibilidad como requisito** (WCAG 2.2 AA): contraste, foco visible, teclado, objetivos táctiles, `prefers-reduced-motion`. La misión de BORAHAE incluye inclusión.
2. **Móvil primero.**
3. **Bilingüe de verdad:** el coreano no es traducción "pegada"; el diseño respeta longitudes, interlineado y `word-break` (keep-all).
4. **Poco, bien hecho:** jerarquía clara, espacio, pocas decoraciones; sin gradientes morado genéricos ni tarjetas anidadas.
5. **Confianza:** datos y donaciones exigen claridad legal y de tratamiento de datos.

## Accessibility & Inclusion

Estándar requerido: WCAG 2.2 nivel AA (contraste, foco, teclado, etiquetas, lector de pantalla en flujos clave). Inclusión como parte de la misión: el sitio debe permitir participar en igualdad de condiciones; evitar cualquier tratamiento folclorizante o estereotipado de Corea o Colombia.

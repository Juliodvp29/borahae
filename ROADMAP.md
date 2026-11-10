# ROADMAP — Sitio web BORAHAE

**Plazo de referencia:** 10 días · **Inicio:** 5 de noviembre de 2026 · **Desarrollador:** 1
**Cómo usar este archivo:** marca `[x]` al terminar cada ítem. Una fase se cierra solo cuando todos sus ítems y su "Criterio de salida" se cumplen. Los ítems `[CLIENTE]` dependen de material del cliente: si faltan, se continúa con marcador `[PENDIENTE-CLIENTE]` y se deja registrado en la Fase 0.

Leyenda: `[CLIENTE]` entrega o aprobación del cliente · `[IMP]` paso con la skill Impeccable · `[ ]` pendiente · `[x]` hecho

## Resumen

| Fase | Nombre | Días estimados |
| --- | --- | --- |
| 0 | Acuerdos y prerrequisitos | Día 0–1 (en paralelo) |
| 1 | Fundación técnica y creación del proyecto | Día 1 |
| 2 | Sistema de diseño y shell bilingüe | Día 2 |
| 3 | Modelo de datos y CMS | Día 3 |
| 4 | Páginas públicas | Días 4–6 |
| 5 | Formularios, eventos y correo | Días 6–7 |
| 6 | SEO, accesibilidad y rendimiento | Día 8 |
| 7 | QA y pruebas de aceptación | Día 9 |
| 8 | Publicación y entrega | Día 10 |
| 9 | Backlog fase 2 (fuera de alcance) | — |

> **Riesgo de plazo:** 10 días solo son realistas si el contenido y las aprobaciones llegan a tiempo. Los textos en español, logo e imágenes son la ruta crítica. Si no están el día 4, el cronograma se mueve (ver spec funcional §12).

---

## Fase 0 — Acuerdos y prerrequisitos

Objetivo: destrabar dependencias del cliente y cerrar decisiones abiertas antes de que bloqueen.

### Decisiones cerradas
- [x] Rutas: `/viajes` es listado y `/viajes/[slug]` es detalle de cada tour. Las rutas públicas completas están definidas en `AGENTS.md` §4.
- [x] Galería, Donaciones, Patrocinio, Contacto y Legal tienen ruta propia. Legal incluye rutas de política de datos, términos y condiciones de viaje.
- [ ] Definir si `modalidad de asistencia` es obligatoria solo en eventos híbridos
- [x] Los eventos de la fase 1 admiten solo personas de 18 años o más. Se valida `dateOfBirth` en servidor, no se persiste, y se exige declaración de mayoría de edad. No hay verificación de identidad ni documentos.
- [x] Antispam sin costo recurrente: implementar honeypot y rate limit. Añadir Cloudflare Turnstile solo si el tráfico real o las pruebas muestran que es necesario y su configuración no añade coste.
- [ ] Decidir botón de WhatsApp (sí/no)
- [x] Revisar y confirmar antes de producción los límites vigentes de Vercel, Neon, Vercel Blob y Resend en las cuentas del cliente. No se asume que un plan gratuito cubra uso futuro.
- [x] Decidir si Impeccable usa telemetría en este proyecto *(hecho: OFF registrada — proyecto de cliente; casilla marcada en revisión post-Fase 3)*

### Pendientes del cliente
- [ ] `[CLIENTE]` Logo oficial (formatos vectoriales)
- [ ] `[CLIENTE]` Textos finales en español
- [ ] `[CLIENTE]` Fotografías autorizadas y organizadas
- [ ] `[CLIENTE]` Dominio adquirido + acceso DNS
- [ ] `[CLIENTE]` Correo institucional creado y dominio verificable en Resend
- [ ] `[CLIENTE]` Datos legales: razón social, NIT, ciudad, contacto
- [ ] `[CLIENTE]` Política de tratamiento de datos (texto aprobado) y términos
- [ ] `[CLIENTE]` Enlaces de redes (Instagram, X, Facebook, TikTok)
- [ ] `[CLIENTE]` Cuenta/enlace de PayPal y datos alternativos (transferencia, Bre-B)
- [ ] `[CLIENTE]` Definición de talleres, primer evento y contenido inicial de viajes
- [ ] `[CLIENTE]` Confirmación de permisos/uso de marca respecto a BTS/FESTA y fórmula de "sin afiliación oficial"
- [ ] `[CLIENTE]` Condiciones de viaje, precio y cancelaciones (solo si se publican)
- [ ] `[CLIENTE]` Revisión humana de traducciones al coreano (acordar quién y cuándo)
- [ ] Crear cuentas (Vercel, Neon, Resend, PayPal) a nombre del cliente con acceso técnico para el desarrollador

**Criterio de salida:** decisiones registradas aquí; lista de pendientes enviada al cliente con fechas.

---

## Fase 1 — Fundación técnica y creación del proyecto

- [x] Crear el proyecto con el generador oficial de Next.js y TypeScript estricto; confirmar App Router, estructura `src/` y gestor `pnpm`
- [x] Publicar a GitHub desde VSCode (publicación rápida); crear rama `dev` y proteger `main` (solo PR) *(regla: PR obligatorio, status check `ci` requerido, sin force-push, lineal, aplica también a admins; 0 aprobaciones requeridas por ser reviewer único)*
- [x] Instalar y configurar Tailwind CSS 4; crear `src/styles/globals.css` con `@import "tailwindcss"` y comprobar que las utilidades compilan *(temporal: globals.css vive en `src/app/(frontend)`; se mueve a `src/styles` en Fase 2)*
- [x] Crear estructura inicial de rutas, componentes, `lib`, `i18n`, `collections` y `globals` según `AGENTS.md` §4 *(colecciones base `users` y `media`; el resto llega en Fase 3)*
- [x] Instalar Payload CMS dentro de la aplicación Next.js y verificar que `/admin` abre localmente *(responde 200 con BD local)*
- [x] Copiar especificaciones a `docs/` y este `AGENTS.md`/`ROADMAP.md` a la raíz
- [x] Base de datos PostgreSQL en Neon; `DATABASE_URL` (conexión pooled) en variables de entorno *(rama `dev` de Neon en `.env` local; producción usa rama `main` en Vercel)*
- [x] Configurar el adaptador Postgres de Payload, `payload.config.ts`, migraciones y tipos generados
- [x] Vercel Blob configurado como almacenamiento de `media` *(store `borahae-media` vinculado a Production/Preview; `BLOB_READ_WRITE_TOKEN` inyectado por Vercel)*
- [x] Añadir scripts `dev`, `typecheck`, `lint`, `build`, migraciones y generación de tipos; verificar compatibilidad con PowerShell y bash
- [x] Crear `.env.example` sin secretos y configurar variables separadas para desarrollo, preview y producción
- [x] Configurar `next/image`, Vercel Blob y la colección `media` base
- [x] Proyecto en Vercel conectado al repo: `main` → producción, `dev`/PR → preview; comprobar un preview funcional *(producción: borahae-kappa.vercel.app con admin creado; primera preview `borahae-a0tbzwblx` en Ready con /admin 200)*
- [x] Añadir workflow de GitHub Actions para instalación reproducible, `typecheck`, `lint` y `build`; verificar una ejecución en PR *(CI verde en dev, en PR y en main; primer merge `dev → main` vía PR #1)*

- [x] `[IMP]` `npx impeccable install` (aceptar hook) y copiar bloque al `.gitignore`
- [x] `[IMP]` `/impeccable init` → `PRODUCT.md` con esquema impeccable reescrito y confirmado *(posicionamiento: integrador cultural único; coreano formal-cortés `[PENDIENTE-CLIENTE]`; paleta confirmada desde logo oficial; buildPath=`code` en `.impeccable/config.json`)*
- [x] `[IMP]` Paso opcional `npx impeccable detect --github src/` en CI *(añadido tras build; exit code 2 falla el CI, AGENTS §7)*

**Criterio de salida:** `pnpm build` pasa en CI; `/admin` abre en preview de Vercel y crea el primer usuario admin.

---

## Fase 2 — Sistema de diseño y shell bilingüe

- [x] Tokens en `@theme` (surface, primary, secondary, primary-hover, text) *(en `src/styles/globals.css`; globals.css movido de `(frontend)` a `src/styles`)*
- [x] Verificación de contraste de cada par de colores usado (secundario solo decorativo) *(primary/surface 7.36:1, text/surface 13.2:1, blanco/primary 8.2:1 — AA ✓; secundario 2.45:1 → solo decorativo, documentado en el propio CSS)*
- [x] Fuentes Noto Serif KR y Noto Sans KR con `next/font`; prueba de Hangul, tildes y ñ *(subsets: `latin` en next-font; Hangul se sirve por unicode-range a demanda — verificado en build; prueba visual de Hangul al revisar el shell)*
- [x] next-intl: rutas `/es` y `/ko`, redirección de `/`, matcher excluyendo `/admin` y `/api` *(v4.14.9; Next 16 usa `src/proxy.ts` — `middleware.ts` deprecado; `/`→307→`/es` verificado, `/admin` y `/api` excluidos, `/es` y `/ko` SSG)*
- [x] `messages/es.json` y `messages/ko.json` para textos fijos (menú, botones, validaciones) *(validaciones llegan con formularios en Fase 5; coreano UI pendiente de revisión humana `[PENDIENTE-CLIENTE]` — anotado en el propio JSON)*
- [x] Layout base: header con navegación, selector de idioma, footer *(header sticky con nav 9 rutas + menú móvil accesible (Escape cierra, foco devuelto, objetivos ≥44px); selector de idioma preserva la ruta actual; footer institucional; correo/redes `[PENDIENTE-CLIENTE]`; WhatsApp y ocultables llegan con `site-settings` Fase 4)*
- [x] Componentes base: botón, enlace, tarjeta, encabezados de sección, campos de formulario, mensajes de estado *(hechos: `Button` (variantes primary/outline, externo con noopener), `Card`, `SectionHeading`; campos de formulario y mensajes de estado se completan con los formularios en Fase 5)*
- [x] Foco visible, navegación por teclado y `prefers-reduced-motion` desde el inicio *(`:focus-visible` global, skip-link funcional, Escape en menú móvil, reduced-motion global; verificación formal en el audit Impeccable)*
- [ ] `[IMP]` `/impeccable shape` del layout y de la página de inicio *(el shell se construyó code-first desde el plan aprobado; `shape` se correrá sobre las páginas reales en Fase 4)*
- [x] `[IMP]` `/impeccable document` → `DESIGN.md` con tokens, tipografía y componentes *(existe en la raíz: frontmatter YAML con tokens máquina + 8 secciones; North Star "El Puente Lavanda" confirmado por el desarrollador en entrevista document)*
- [x] `[IMP]` `critique` + `typeset` + `layout` sobre el shell *(critique dual-agent 29/40 con snapshot en `.impeccable/critique/`; los 3 hallazgos P1 corregidos: `aria-current` en nav vía `NavLink`, breakpoint nav `lg`, textura de marca en hero. Tendencia y re-corrida del critique pendientes; `typeset`/`layout` como comandos no fue necesario correr tras corregir los P1 y quedan para Fase 4)*
- [x] `/impeccable polish` de los hallazgos P2/P3 editados en el snapshot del critique *(los 4 resueltos y verificados en vivo: backdrop accesible del menú móvil (botón cierre, tap fuera), globito aria-hidden + `hrefLang` en switcher, año de footer aceptado como año de build (documentado en el código), hover del outline decidido como flip sólido con texto blanco)*

**Criterio de salida:** shell navegable en ambos idiomas y en móvil/escritorio; `DESIGN.md` en el repo; `audit` sin P0/P1.

---

## Fase 3 — Modelo de datos y CMS

- [x] Payload Localization con locales `es` (por defecto) y `ko` con fallback a `es`
- [x] Colección `users` con roles `admin` y `editor`; permisos por colección y por campo
- [x] Colecciones: `pages`, `programs`, `tours`, `events`, `event-registrations`, `contact-submissions`, `media`, `gallery`, `sponsors`
- [x] Global `site-settings` (logo, contacto, redes, donaciones, navegación, datos institucionales, `galleryEnabled`, `sponsorshipEnabled`, `whatsAppEnabled` y enlace/número de WhatsApp)
- [x] Campos localizables: título, descripción, contenido, SEO (título, descripción, imagen OG), `alt` de imágenes
- [x] `events`: modalidad (presencial/virtual/híbrido), fechas, cupo opcional (`capacity` + activar/desactivar), estado y elegibilidad 18+
- [x] `event-registrations` y `contact-submissions` **no accesibles desde la API pública**
- [x] Configuración de `media`: tipos y tamaños permitidos; conversión/uso de WebP y tamaños por componente
- [x] Hooks de revalidación de rutas al publicar contenido
- [x] Migraciones creadas y probadas; `payload-types.ts` generado
- [x] Cuenta de editor creada para el representante legal con prueba de permisos *(en dev: `editor.demo@borahae.dev` con contraseña temporal; cambiar antes de crear la cuenta real)*
- [ ] Vista previa/borradores si aplica *(borradores activos; la vista previa pública llega con las páginas de Fase 4)*
- [x] Datos de ejemplo (seed) para desarrollo, claramente marcados como ficticios

**Criterio de salida:** el editor crea y edita contenido en es/ko, sube imágenes y no puede acceder a usuarios ni configuración técnica.

**Decisiones y notas de la fase:**
- Los selects de estado en `programs`/`tours` se llaman `state`, no `status`: el nombre `status` colisionaba con el `_status` de publicación en la nomenclatura de enums de drizzle y rompía el SQL de la migración.
- Reparación de BD dev: la migración fallida dejó el esquema a medias; se aplicó `migrate:fresh` a la rama Neon dev (solo demo; el usuario admin se respaldó y restauró con su contraseña intacta).
- `npx payload seed` / `npx payload db-report`: comandos propios vía `bin` en `payload.config.ts` (`payload run` no ejecuta scripts de forma fiable aquí — la config no resuelve bajo `run`).
- `next/cache` se importa dentro del hook de revalidación para no romper el CLI de Payload fuera de Next.
- Verificación de permisos con REST: anónimo y editor no pueden crear `contact-submissions`/`event-registrations` (403); el editor no entra a `users` (403) pero sí lee ambas submissions (200).
- Sponsors listos pero ocultos hasta `sponsorshipEnabled`; precio/condiciones de viajes solo con aprobación escrita del cliente (`priceNote`).
- **BD dev local en endpoint unpooled de Neon**: con el pooler (pgbouncer en modo transacción), las transacciones de borradores huérfanas por recarga de Turbopack saturaban el pool y colgaban `/admin` (error 25P03 idle-in-transaction). El endpoint pooled se usa solo en Vercel/serverless (AGENTS §5).
- **Pool de Payload agrandado (dev 10, prod 5)**: `max: 2` en `payload.config.ts` hacía que todo el panel serializara detrás de un solo find largo de borrador (GET `/api/pages/1?draft=true` de 68.9s) — la pestaña quedaba cargando sin fin. Neon mata transacciones inactivas a los 5min (`idle_in_transaction_session_timeout`), lo que explica los bloqueos de 5–6min documentados arriba.

**Criterio de salida:** el editor crea y edita contenido en es/ko, sube imágenes y no puede acceder a usuarios ni configuración técnica.

---

## Fase 4 — Páginas públicas

Rutas bajo `/es/...` y `/ko/...`. Para cada página: contenido desde Payload, metadatos por idioma, un solo `h1`, estados vacíos y de error.

- [x] **Inicio:** banner editable, presentación, llamados a la acción, destacados, redes *(Batch B: doc CMS `pages/inicio` con banner próximo/copy aprobado como imagen de referencia visual; banner Desktop/Móvil editables con fallback a assets empacados; destacados de programas + redes `[PENDIENTE-CLIENTE]`; ISR 5 min + revalidación por hooks)*
- [x] **Nosotros:** presentación, propósito, misión, visión, valores/inclusión, datos institucionales *(Batch B: doc CMS `pages/nosotros` con textos reales del cliente (misión/visión/objetivos/pilares de `docs/Contenido_Cliente_Mision_Vision.md`); ko con fallback automático al español; datos institucionales `[PENDIENTE-CLIENTE]`)*
- [x] **Programas:** página principal + rutas de Curso de coreano, Becas y Talleres (con estado "próximamente" si no hay contenido) *(Batch C: hub con tarjetas nombre/resumen/badge + detalle por slug (whitelist de slugs de la spec); los 3 en `upcoming` con texto de EJEMPLO aprobado por el cliente (2026-11-10) mientras llega la info oficial; RichText listo para el editor; ISR 5 min + revalidación por hooks)*
- [x] **Viajes:** listado y detalle `/viajes/[slug]` (fechas, destino, itinerario, incluye/no incluye, precio y condiciones si se publican, botón de interés) *(Batch D: 100% CMS desde `tours`; sin whitelist de slug — doc inexistente → 404; fechas con Intl es-CO/ko-KR; priceNote limpio de marcadores al render; CTA de interés → contacto; ISR 5 min; BORAHAE TRIP 2027 copiado a prod)*
- [x] **Eventos:** listado de próximos eventos y detalle de cada uno (modalidad, cupo disponible si aplica) *(Batch E: 100% CMS desde `events`; modalidad/lugar/fechas/cupo; bloque informativo "inscripción próximamente" + nota 18+ — el formulario real es Fase 5; prod inicia vacío, el editor crea los eventos desde /admin)*
- [ ] **Galería:** fotos autorizadas; videos o enlaces si se requieren
- [x] **Donaciones:** botón PayPal, datos de transferencia/Bre-B opcionales, mensaje de destino *(Batch G: 100 % CMS desde `site-settings`; sin PayPal configurado → card "en preparación" con CTA a contacto (form ya tiene motivo Donación); transferencia renderizada línea por línea; proposito es/ko con fallback; ISR 5 min; smoke de ambos estados en DOM y BD restaurada)*
- [ ] **Patrocinio:** sección preparada (visible solo si `sponsorshipEnabled` está activo desde el CMS)
- [x] **Contacto:** formulario general (se conecta en Fase 5) *(Batch F: página + formulario en vivo; `POST /api/contact` con Zod compartido, honeypot, rate limit en BD y guardado+consentimiento; notificación Resend implementada en espera de la cuenta `[CLIENTE]`)*
- [ ] **Legal:** hub y rutas propias para razón social/NIT/ciudad, política de datos, términos y condiciones de viaje (esta última solo si aplica)
- [x] Galería y acceso de WhatsApp se muestran u ocultan según `galleryEnabled` y `whatsAppEnabled` de `site-settings` *(nav y botón flotante respetan los toggles vía API local; la página de galería y contenido destacado se construyen en su batch específico)*
- [x] Páginas 404 y de error traducidas *(catch-all `[locale]/[...rest]` lanza `notFound()` para que el 404 renderice con branding/traducciones; `error.tsx` client con `{ error, retry }` de Next 16 y sin detalles internos; probados /es/ko con server de producción)*
- [ ] Aviso de no afiliación con BTS/FESTA, **solo** con redacción aprobada por el cliente
- [ ] `[IMP]` Por página: `shape` → construir → `critique` → `audit` → corregir
- [ ] `[IMP]` `bolder`/`quieter`/`distill` según la dirección visual acordada con el cliente
- [ ] `[IMP]` `adapt` (móvil, tableta, escritorio) y `clarify` (microcopy) en todas las páginas

**Criterio de salida:** todas las páginas del alcance publicadas en preview, en ambos idiomas, con contenido real o marcadores `[PENDIENTE-CLIENTE]`.

---

## Fase 5 — Formularios, eventos y correo

- [x] Esquema de validación compartido cliente/servidor (p. ej. Zod) con mensajes es/ko *(Batch F: `src/lib/contact-schema.ts`, contacto; el de eventos en Fase 5)*
- [x] Endpoint de **contacto/interés** con los campos de la spec funcional §7.1 *(Batch F: `POST /api/contact`; nuevo campo `ageRange` (decisión 2026-11-10) con migración `20261110_175427`; teléfono requerido)*
- [ ] Endpoint de **inscripción a evento** con los campos de §7.2
- [ ] Rechazar registros de menores de 18 años: recibir `dateOfBirth`, validar edad en servidor, no guardar la fecha y persistir solo la trazabilidad de elegibilidad
- [x] Consentimiento de política de datos obligatorio, guardado con fecha/hora y versión del texto *(Batch F, contacto: `acceptedAt` + `policyVersion` en el registro)*
- [x] Antispam (Turnstile u honeypot) y rate limiting en ambos endpoints *(Batch F, contacto: honeypot + rate limit en BD (3/24 h por correo, 50/h global, sin IP); Turnstile queda como mejora futura — spec técnica admite honeypot. Eventos: Fase 5)*
- [x] Guardado en PostgreSQL antes de enviar correo *(Batch F, contacto)*
- [ ] Notificación al correo institucional con Resend; manejo de fallo sin perder el registro
- [ ] Dominio verificado en Resend `[CLIENTE]` (mientras tanto, remitente de pruebas)
- [ ] **Cupo de eventos:** bloqueo de nuevos registros al alcanzar el límite, con control de concurrencia y mensaje claro
- [x] Estados de formulario accesibles: cargando, éxito, error, campo inválido *(Batch F, contacto: errores por campo con `aria-invalid`/`aria-describedby`, `aria-live` de resumen y `role="alert"`)*
- [x] Confirmación en pantalla al visitante (correo de confirmación al visitante = mejora posterior) *(Batch F, contacto)*
- [ ] Pruebas: registro duplicado, evento lleno, spam, correo caído, campos inválidos
- [ ] `[IMP]` `harden` sobre formularios (errores, desbordes, textos largos en coreano)

**Criterio de salida:** envío real de formulario → fila en BD → correo recibido; el límite de cupos se respeta bajo solicitudes simultáneas.

---

## Fase 6 — SEO, accesibilidad y rendimiento

- [ ] Metadatos únicos por página e idioma (título, descripción, Open Graph)
- [ ] `hreflang` es/ko/x-default
- [ ] `sitemap.xml` dinámico con ambas versiones y `robots.txt`
- [ ] Datos estructurados JSON-LD (organización y eventos)
- [ ] Imágenes WebP, `sizes` correctos y `alt` completos
- [ ] Revisión WCAG 2.2 AA: contraste, foco, teclado, etiquetas, lector de pantalla en flujos clave
- [ ] Rendimiento básico: Lighthouse móvil, LCP/CLS razonables, fuentes con subconjuntos
- [ ] Cabeceras de seguridad y CSP validadas (Turnstile, Blob, fuentes, admin de Payload)
- [ ] `[IMP]` `audit` global (sin P0/P1) y `optimize`
- [ ] `[IMP]` `polish` final por página

**Criterio de salida:** `audit` sin P0/P1; Lighthouse sin errores críticos de accesibilidad ni SEO.

---

## Fase 7 — QA y pruebas de aceptación

Corresponde a la spec técnica §17.

- [ ] Visualización correcta en móvil, tableta y escritorio
- [ ] Navegación en español y coreano
- [ ] Cambio de idioma conserva la ruta equivalente
- [ ] Panel de administración y permisos por rol
- [ ] Creación y edición de contenido, imágenes, eventos y tours
- [ ] Guardado de formularios en PostgreSQL
- [ ] Notificaciones al correo institucional (una vez configurado)
- [ ] Límite opcional de cupos por evento
- [ ] Antispam y validaciones de formularios
- [ ] Imágenes WebP y rendimiento básico
- [ ] Metadatos, sitemap, robots y `hreflang`
- [ ] Revisión de textos coreanos con el revisor humano `[CLIENTE]`
- [ ] Prueba en navegadores principales (Chrome, Safari, Firefox, Edge) y en dispositivo móvil real
- [ ] Revisión del cliente en preview y lista de correcciones registrada

**Criterio de salida:** los 12 puntos de aceptación técnica en verde; lista de correcciones del cliente cerrada o priorizada.

---

## Fase 8 — Publicación y entrega

- [ ] Contenido final cargado y aprobado por el cliente
- [ ] Variables de entorno de producción verificadas
- [ ] Copia de seguridad de la base de datos antes del lanzamiento; revisión de retención/respaldos en Neon
- [ ] Migraciones aplicadas en producción
- [ ] Pull Request `dev` → `main` aprobado y CI en verde
- [ ] Dominio del cliente conectado (DNS) y HTTPS activo
- [ ] Prueba final en producción: formularios, correo, cupos, idiomas, `/admin`
- [ ] Búsqueda indexable (`robots` correcto en producción, no en previews); sitemap enviado a buscadores si el cliente lo desea
- [ ] Guía breve de uso del panel para el editor (PDF o `docs/`)
- [ ] Traspaso de credenciales y cuentas a nombre del cliente
- [ ] Aprobación final de publicación por el cliente
- [ ] Acta de entrega con el alcance cubierto y lo excluido (spec técnica §18–19)

**Criterio de salida:** sitio en el dominio final, aprobado por el cliente, con guía entregada.

---

## Fase 9 — Backlog fase 2 (fuera de alcance, requiere cotización)

- [ ] Pasarela de pagos integrada, cuotas o financiación de viajes
- [ ] Inscripción formal a viajes y gestión de cupos de viaje
- [ ] Tiquetes, QR y control de asistencia
- [ ] Lista de espera automática para eventos
- [ ] Área privada de miembros
- [ ] Correo de confirmación al visitante y campañas
- [ ] Analítica avanzada y reportes
- [ ] Aplicación móvil
- [ ] Mantenimiento mensual y soporte continuo

---

## Registro de decisiones y bloqueos

| Fecha | Decisión / bloqueo | Responsable |
| --- | --- | --- |
| 2026-11-05 | Inicio del proyecto; especificaciones v1.0 | Desarrollador |
| 2026-11-05 | Rutas públicas completas definidas; `/viajes/[slug]` representa el detalle de tour | Desarrollador |
| 2026-11-05 | Eventos de fase 1: registros solo para mayores de 18 años; fecha de nacimiento validada en servidor y no persistida | Desarrollador |
| 2026-11-05 | Antispam base: honeypot + rate limit sin costo recurrente; Turnstile queda como refuerzo condicionado | Desarrollador |
| 2026-11-05 | `site-settings` administrará visibilidad de Galería, Patrocinio y WhatsApp | Desarrollador |
| 2026-11-05 | Fase 1: primero se crea el proyecto Next.js y luego se publica a GitHub desde VSCode (publicación rápida); cuentas de GitHub, Vercel y Neon del desarrollador — sin bloqueo para Fase 1 | Desarrollador |
| 2026-11-05 | Bug payload 3.93/tsx 4.23.15/undici ("Illegal constructor"): CLI de Payload se ejecuta con `--use-swc` (@swc-node/register) y el repo usa `"type": "module"` | Desarrollador |
| 2026-11-05 | `cacheComponents`/`partialPrefetching` de Next 16 deshabilitados por compatibilidad con Payload (doc oficial advierte riesgo); se revisa en Fase 4 | Desarrollador |
| 2026-11-05 | BD local: PostgreSQL 18 en `localhost:5432/borahae`; se eliminó `DATABASE_URL` global de Windows en favor del `.env` por proyecto (dotenv con `override` en payload.config) | Desarrollador |
| 2026-11-05 | Neon: rama `dev` para local/preview, rama `main` para producción; `PAYLOAD_SECRET` secreto por ambiente en Vercel | Desarrollador |
| 2026-11-05 | CI: `npx next typegen` antes de `typecheck` (Next 16 genera tipos de rutas en `.next/`, no versionados) | Desarrollador |
| 2026-11-05 | Impeccable instalado (v4.8.0, skill en `.github`) con telemetría OFF (proyecto de cliente) | Desarrollador |
| 2026-11-06 | Primer merge `dev → main` vía PR #1 con CI verde; producción desplegada desde git | Desarrollador |
| 2026-11-06 | `PRODUCT.md` reescrito al esquema impeccable (init): posicionamiento "integrador cultural único"; registro coreano `[PENDIENTE-CLIENTE]`; paleta morada confirmada como derivada del logo oficial recibido; Impeccable `buildPath=code` | Desarrollador |
| 2026-11-06 | Fase 2: tokens `@theme` en `src/styles/globals.css` (movido desde `(frontend)`); fuentes Noto via `next/font` sin subset `korean` explícito (next/font lo sirve por unicode-range a demanda); eslint ignora `.github/skills`, `src/migrations` y `payload-types.ts` | Desarrollador |
| 2026-11-06 | Cliente entrega textos oficiales de Misión/Visión/Objetivos (guardados en `docs/Contenido_Cliente_Mision_Vision.md`) y autoriza libertad creativa dentro de la idea principal | Desarrollador |
| 2026-11-06 | next-intl 4.14.9 con convención `proxy.ts` de Next 16 (middleware deprecado); textos oficiales del cliente como fuente de `nosotros`; UI coreana pendiente de revisión humana | Desarrollador |
| 2026-11-06 | Shell: header/footer componentes de servidor; interactivo solo en menú móvil + selector de idioma (client); `:lang(ko) keep-all`; Home usa `Button` (variantes); `lang="ko"` interlineado 1.77 | Desarrollador |
| 2026-11-06 | Impeccable critique 29/40; P1 corregidos (aria-current, nav breakpoint lg, textura hero con barra Wisteria); DESIGN.md creado (North Star "El Puente Lavanda", plano-tonal, 5 tokens orquídea); P2/P3 pendientes en polish de Fase 4 | Desarrollador |
| 2026-11-09 | Fase 4 (a): prerender en build con `DATABASE_URL`/`PAYLOAD_SECRET` como secrets de CI (endpoint **pooled** de Neon); lectura pública vía API local de Payload (`src/lib/payload.ts`) | Desarrollador |
| 2026-11-09 | Toggles en header/footer: `site-settings` con hook global de revalidación (`revalidateGlobalHooks` revalida el listado completo de rutas en es/ko); logo editable con fallback a texto si Media no lo tiene | Desarrollador |
| 2026-11-09 | 404 con branding: catch-all `[locale]/[...rest]` lanza `notFound()` (el default global de Next ignoraba layout/idioma); `error.tsx` con firma Next 16 `{ error, retry }`, sin detalle interno | Desarrollador |
| 2026-11-09 | Identidad visual: cliente entrega granallado de marca; desarrollador convierte a WebP (logo-borahae 1080×1350 80KB, banner-web 2560×1440 35KB, banner-mobile 1350×1080 22KB); logo horizontal (480×186, 25KB) recortado con sharp desde la versión generada en Canva. Header: logo desde el CMS (`site-settings.logo`) con fallback al WebP empacado en `public/images` hasta que el editor lo cargue en Media | Desarrollador |
| 2026-11-09 | Fase 4 Batch B (Inicio + Nosotros): banners Desktop/Móvil en `Pages` (migración `20261109_195908`); seed con docs `inicio` y `nosotros` (textos reales del cliente). JSON-LD Organization en `<head>` vía layout de locale | Desarrollador |
| 2026-11-09 | Fix seeds Lexical: nodos texto requieren `type: 'text'` (sin él RichText renderiza "unknown node"); `list.tag` ∈ {ol, ul}; hijos de `listitem` son párrafos (texto suelto rechaza al publicar); `listitem.value` numérico (0 en bullets, 1..n en ordenados) | Desarrollador |
| 2026-11-09 | ISR `revalidate = 300` en páginas Batch B: `revalidatePath` disparado desde la API de Payload no purga el prerender HTML de `next start` de forma confiable; los hooks de revalidación se conservan como invalidación inmediata cuando funciona | Desarrollador |
| 2026-11-09 | `tmp/` (script OPS one-off de restauración) excluido de ESLint y gitignored; lint verde tras `no-require-imports` en scripts locales | Desarrollador |
| 2026-11-10 | Traducción coreana de `pages/inicio` provista por el desarrollador (title + summary + content, locale `ko`); página es intacta y ko con fallback listo si algún campo falta. Pendiente revisión humana formal del coreano (AGENTS §5.1) | Desarrollador |
| 2026-11-10 | API local de Payload: las queries del frontend ahora pasan `locale` + `fallbackLocale: "es"` — sin `locale` explícito devolvían sí o sí el default (es); fix en home y nosotros (componente + generateMetadata) | Desarrollador |
| 2026-11-10 | Batch C (Programas): hub + detalle `/programas/[slug]` con whitelist de slugs de la spec (resto → 404); cliente aprueba textos de EJEMPLO coherentes sin datos inventados (precios/horarios/montos) mientras llega la info original; seed y BD alineados (todo `upcoming`, sin DEMO_TAG en summaries públicos) | Desarrollador |
| 2026-11-10 | Traducción coreana de `pages/nosotros` (title + summary + content: 미션/비전/총괄 목표/세부 목표/핵심 가치) generada por IA a solicitud del desarrollador; **pendiente de revisión humana antes de publicar** (AGENTS §5.1) — falta confirmar el texto con el revisor | Desarrollador |
| 2026-11-10 | Regla de marca: **BORAHAE nunca se translitera** (no "보라헤") — corregidos ko.json (meta, header, home) y summary de la doc nosotros en la BD; el nombre queda siempre en script latino | Desarrollador |
| 2026-11-10 | Deploy prod falló (`relation "site_settings" does not exist`): BD de producción sin migraciones. Correctivo: `pnpm payload:migrate` contra la URL **pooled** de prod intercambiando temporalmente `.env` (el CLI de Payload sobreescribe `DATABASE_URL` de proceso con el de `.env`) → 43 tablas/3 migraciones; luego volcado de contenido editorial dev→prod vía `pg_dump/pg_restore --data-only` (pages, programs, site_settings; excluye users, `_v` versiones, events demo) + secuencias fijadas por el propio restore + marcador DEMO limpiado de legal | Desarrollador |
| 2026-11-10 | `vercel.json` con `buildCommand: pnpm payload:migrate && pnpm build` para auto-migrar en cada deploy de Vercel (incluido en commit Batch B+C esperar verificación CI) | Desarrollador |
| 2026-11-10 | Smoke de producción verde tras redeploy: home/nosotros/programas es+ko con contenido CMS, 404 con branding, JSON-LD, /admin accesible. Pendientes operativos: admin de prod creado por el desarrollador, Blob store en Vercel para uploads, rotar credenciales de BD expuestas en chat | Desarrollador |
| 2026-11-10 | Batch D (Viajes): listado + detalle 100% CMS. A diferencia de Programas, `[slug]` **sin whitelist** (el editor crea nuevos viajes sin tocar código); helper `src/lib/markers.ts` (`cleanText`) para que los marcadores `[PENDIENTE-CLIENTE]`/`[CONTENIDO-FICTICIO-DEMO]` del CMS nunca se rendericen al público; fechas formateadas con `Intl.DateTimeFormat("es-CO"/"ko-KR")`; itinerario/incluye/no-incluye no se pintan si están vacíos; CTA de interés (sin inscripción, fase 2 del negocio). Tour BORAHAE TRIP 2027 (texto real del cliente) volcado dev→prod en tablas `tours*` | Desarrollador |
| 2026-11-10 | Batch E (Eventos): listado + detalle 100% CMS; sin formulario (Fase 5) — el detalle muestra "inscripción próximamente" y la nota 18+ como texto informativo (la validación real será en servidor con el endpoint). `locationUrl` solo se enlaza si es https y con `rel="noopener noreferrer"`. **No se copia el evento demo dev→prod**: el listado público arranca vacío con estado "próximamente"; el editor crea el evento real. Claves `events.*` es/ko (pendientes de revisión humana como el resto del coreano) | Desarrollador |
| 2026-11-10 | Batch F (Contacto): página + `POST /api/contact` con el flujo AGENTS §5.3. Decisiones: campo **`ageRange`** agregado a la colección (decisión del desarrollador; migración `20261110_175427`, dev aplicada; prod lo recibe con el build de Vercel) y **teléfono requerido** según spec §7.1. Antispam = **honeypot** (Turnstile queda anotado como mejora — la spec técnica permite honeypot sin costo); rate limit en BD **sin almacenar IP** (3/24 h por correo + 50/h global). Email por **`fetch` a la API REST de Resend** (sin dependencia) con degradación elegante: sin `RESEND_API_KEY` o el correo institucional vacío, el registro se guarda igual y solo se omite la notificación. `POLICY_VERSION` = "2026-11-10" `[PENDIENTE-CLIENTE]` versión real del texto. Smoke local: 201×3, 429 al 4.º, 400 sin consentimiento, 200 honeypot sin guardar; filas de prueba eliminadas. Pendiente de su lado: cuenta Resend + correo institucional (settings) + dominio verificado; revisión humana del coreano de contacto | Desarrollador |
| 2026-11-10 | Batch G (Donaciones): página 100 % CMS desde `site-settings` (paypalUrl, transferInfo, donationNote ya existían; **sin migraciones y sin volcado**). Estados verificados en DOM: sin datos → card "en preparación" + CTA a `/contacto`, con PayPal → botón externo con `target=_blank rel=noopener noreferrer` y validación de esquema https; transferencia se pinta línea por línea; el propósito se muestra si existe (es/ko con fallback). `findGlobal` ahora recibe `locale` + `fallbackLocale` explícitos (los campos localizados del global llegaban defaulteados). Nota de desarrollo: al hacer smoke el **bundle de mensajes next-intl incrustado en el HTML** contiene todos los textos → `Contains` directo da falsos positivos; hay que filtrar `<script>` y verificar el DOM. Pendiente `[CLIENTE]`: PayPal real, banco/Bre-B y el propósito definitivo (el editor los llena en /admin; ko requiere revisión humana) | Desarrollador |

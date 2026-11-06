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
- [ ] Decidir si Impeccable usa telemetría en este proyecto *(hecho: OFF registrada — proyecto de cliente)*

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
- [ ] `[IMP]` Paso opcional `npx impeccable detect --github src/` en CI

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
- [ ] `[IMP]` `/impeccable shape` del layout y de la página de inicio
- [ ] `[IMP]` `/impeccable document` → `DESIGN.md` con tokens, tipografía y componentes
- [ ] `[IMP]` `critique` + `typeset` + `layout` sobre el shell

**Criterio de salida:** shell navegable en ambos idiomas y en móvil/escritorio; `DESIGN.md` en el repo; `audit` sin P0/P1.

---

## Fase 3 — Modelo de datos y CMS

- [ ] Payload Localization con locales `es` (por defecto) y `ko` con fallback a `es`
- [ ] Colección `users` con roles `admin` y `editor`; permisos por colección y por campo
- [ ] Colecciones: `pages`, `programs`, `tours`, `events`, `event-registrations`, `contact-submissions`, `media`, `gallery`, `sponsors`
- [ ] Global `site-settings` (logo, contacto, redes, donaciones, navegación, datos institucionales, `galleryEnabled`, `sponsorshipEnabled`, `whatsAppEnabled` y enlace/número de WhatsApp)
- [ ] Campos localizables: título, descripción, contenido, SEO (título, descripción, imagen OG), `alt` de imágenes
- [ ] `events`: modalidad (presencial/virtual/híbrido), fechas, cupo opcional (`capacity` + activar/desactivar), estado y elegibilidad 18+
- [ ] `event-registrations` y `contact-submissions` **no accesibles desde la API pública**
- [ ] Configuración de `media`: tipos y tamaños permitidos; conversión/uso de WebP y tamaños por componente
- [ ] Hooks de revalidación de rutas al publicar contenido
- [ ] Migraciones creadas y probadas; `payload-types.ts` generado
- [ ] Cuenta de editor creada para el representante legal con prueba de permisos
- [ ] Vista previa/borradores si aplica
- [ ] Datos de ejemplo (seed) para desarrollo, claramente marcados como ficticios

**Criterio de salida:** el editor crea y edita contenido en es/ko, sube imágenes y no puede acceder a usuarios ni configuración técnica.

---

## Fase 4 — Páginas públicas

Rutas bajo `/es/...` y `/ko/...`. Para cada página: contenido desde Payload, metadatos por idioma, un solo `h1`, estados vacíos y de error.

- [ ] **Inicio:** banner editable, presentación, llamados a la acción, destacados, redes
- [ ] **Nosotros:** presentación, propósito, misión, visión, valores/inclusión, datos institucionales
- [ ] **Programas:** página principal + rutas de Curso de coreano, Becas y Talleres (con estado "próximamente" si no hay contenido)
- [ ] **Viajes:** listado y detalle `/viajes/[slug]` (fechas, destino, itinerario, incluye/no incluye, precio y condiciones si se publican, botón de interés)
- [ ] **Eventos:** listado de próximos eventos y detalle de cada uno (modalidad, cupo disponible si aplica)
- [ ] **Galería:** fotos autorizadas; videos o enlaces si se requieren
- [ ] **Donaciones:** botón PayPal, datos de transferencia/Bre-B opcionales, mensaje de destino
- [ ] **Patrocinio:** sección preparada (visible solo si `sponsorshipEnabled` está activo desde el CMS)
- [ ] **Contacto:** formulario general (se conecta en Fase 5)
- [ ] **Legal:** hub y rutas propias para razón social/NIT/ciudad, política de datos, términos y condiciones de viaje (esta última solo si aplica)
- [ ] Galería y acceso de WhatsApp se muestran u ocultan según `galleryEnabled` y `whatsAppEnabled` de `site-settings`
- [ ] Páginas 404 y de error traducidas
- [ ] Aviso de no afiliación con BTS/FESTA, **solo** con redacción aprobada por el cliente
- [ ] `[IMP]` Por página: `shape` → construir → `critique` → `audit` → corregir
- [ ] `[IMP]` `bolder`/`quieter`/`distill` según la dirección visual acordada con el cliente
- [ ] `[IMP]` `adapt` (móvil, tableta, escritorio) y `clarify` (microcopy) en todas las páginas

**Criterio de salida:** todas las páginas del alcance publicadas en preview, en ambos idiomas, con contenido real o marcadores `[PENDIENTE-CLIENTE]`.

---

## Fase 5 — Formularios, eventos y correo

- [ ] Esquema de validación compartido cliente/servidor (p. ej. Zod) con mensajes es/ko
- [ ] Endpoint de **contacto/interés** con los campos de la spec funcional §7.1
- [ ] Endpoint de **inscripción a evento** con los campos de §7.2
- [ ] Rechazar registros de menores de 18 años: recibir `dateOfBirth`, validar edad en servidor, no guardar la fecha y persistir solo la trazabilidad de elegibilidad
- [ ] Consentimiento de política de datos obligatorio, guardado con fecha/hora y versión del texto
- [ ] Antispam (Turnstile u honeypot) y rate limiting en ambos endpoints
- [ ] Guardado en PostgreSQL antes de enviar correo
- [ ] Notificación al correo institucional con Resend; manejo de fallo sin perder el registro
- [ ] Dominio verificado en Resend `[CLIENTE]` (mientras tanto, remitente de pruebas)
- [ ] **Cupo de eventos:** bloqueo de nuevos registros al alcanzar el límite, con control de concurrencia y mensaje claro
- [ ] Estados de formulario accesibles: cargando, éxito, error, campo inválido
- [ ] Confirmación en pantalla al visitante (correo de confirmación al visitante = mejora posterior)
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

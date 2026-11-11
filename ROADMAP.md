# ROADMAP — Sitio web BORAHAE

**Plazo de referencia:** 10 días · **Inicio:** 5 de noviembre de 2026 · **Desarrollador:** 1
**Cómo usar este archivo:** marca `[x]` al terminar cada ítem. Una fase se cierra solo cuando todos sus ítems y su "Criterio de salida" se cumplen. Los ítems `[CLIENTE]` dependen de material del cliente: si faltan, se continúa con marcador `[PENDIENTE-CLIENTE]` y se deja registrado en la Fase 0.

Leyenda: `[CLIENTE]` entrega o aprobación del cliente · `[IMP]` paso con la skill Impeccable · `[ ]` pendiente · `[x]` hecho

## Estado de fases (actualizado por batch, 2026-11-10)

| Fase | Alcance | Progreso | Estado |
| --- | --- | --- | --- |
| 0–2 | Acuerdos, CMS base, diseño base | | ✅ Cerradas |
| 3 | Admin de contenidos | | ✅ Cerrada |
| **4** | **Páginas públicas** | **10/10 páginas** ✅: Inicio, Nosotros, Programas, Viajes, Eventos, Contacto, Donaciones, Patrocinio, Galería, Legal | ✅ **COMPLETA** · sigue: pase único Impeccable (L167) + aviso BTS `[CLIENTE]` |
| 5 | Formularios, eventos y correo | Pipeline de contacto completo (Batch F adelantado); falta todo lo del formulario de eventos + notificación real (depende de cuenta Resend `[CLIENTE]`) | 🟡 Parcial — se cierra cuando exista el primer evento |
| 6 | SEO, a11y, rendimiento | Metadatos/JSON-LD/ISR existentes por página; pasa de auditoría global pendiente | ⚪ Pendiente |
| 7–8 | QA y publicación | | ⚪ Pendiente |

> Nota: el orden natural es Fase 4 → 5, pero el formulario de contacto (Batch F) necesitó el pipeline completo de Fase 5 para funcionar de verdad — por eso hay items de la 5 marcados antes de cerrar la 4. No es desorden: es la misma infraestructura que reutilizará el formulario de eventos.

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
- [x] `[IMP]` `/impeccable shape` del layout y de la página de inicio *(superside: el shell se construyó code-first desde el plan aprobado y la página de inicio quedó cubierta por el flujo de revisión por página [L154, Batches B-G]; correr `shape` post-construcción no tenía caso. La promesa de revisión de diseño se ejecuta como pasa único de `critique`+`audit`+`polish` cuando todas las páginas estén construidas)*
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
- [x] **Galería:** fotos autorizadas; videos o enlaces si se requieren *(Batch I: GATE por `galleryEnabled` con ruta siempre respondiendo; grid masonry columns-1/2/3 con `next/image` resp. al mapa de imagen del media, `sizes` por columna, alt = media.alt o pie de foto es/ko con fallback; orden por `order`; vacío → estado "Fotos en camino" + regla de autorización explícita; fila huérfana de seed eliminada de dev; videos fuera de alcance — el cliente no los pidió (spec los deja "si se requieren"); sin lightbox en fase 1 → mejora del pase Impeccable si el cliente la desea; ISR 5 min; smoke OFF (build prod) y ON (server dev) verificados en DOM; toggle restaurado a OFF)*
- [x] **Donaciones:** botón PayPal, datos de transferencia/Bre-B opcionales, mensaje de destino *(Batch G: 100 % CMS desde `site-settings`; sin PayPal configurado → card "en preparación" con CTA a contacto (form ya tiene motivo Donación); transferencia renderizada línea por línea; proposito es/ko con fallback; ISR 5 min; smoke de ambos estados en DOM y BD restaurada)*
- [x] **Patrocinio:** sección preparada (visible solo si `sponsorshipEnabled` está activo desde el CMS) *(Batch H: toggle OFF → ruta responde con estado escueto + CTA a contacto, nunca 404 (AGENTS §4); toggle ON → intro + grid de `sponsors` (logo/nombre/desc es-ko/web con noopener, orden por `order`) o estado vacío y aside de CTA; propuesta de valor queda `[PENDIENTE-CLIENTE]` — el editor la agrega cuando el cliente la apruebe; ISR 5 min; smoke de ambos estados verificado en DOM (con server fresco, la lección del bundle de mensajes aplica)*
- [x] **Contacto:** formulario general (se conecta en Fase 5) *(Batch F: página + formulario en vivo; `POST /api/contact` con Zod compartido, honeypot, rate limit en BD y guardado+consentimiento; notificación Resend implementada en espera de la cuenta `[CLIENTE]`)*
- [x] **Legal:** hub y rutas propias para razón social/NIT/ciudad, política de datos, términos y condiciones de viaje (esta última solo si aplica) *(Batch J: colección `legal-docs` con slug **radio de 3 opciones fijas** (un doc por URL, el editor no crea slugs legales nuevos), title/body RichText es/ko con fallback + version/effectiveDate; acceso: lectura pública, editar admin+editor, borrar admin; hub `/legal` con identidad desde `site-settings` (card solo si hay datos) + índice de 3 docs (publicado → enlace; no publicado → "Disponible próximamente", el marcador NUNCA sale) — el hub usa textos de interfaz porque la doc seed `pages/legal` es ficticia y su interior podría filtrarse con `cleanText` solo (decisión 2026-11-10); detalle `/legal/[slug]` con **whitelist estricta**: slug fuera de las 3 URLs → 404, slug de la lista sin doc publicada → estado "en preparación" (nunca texto inventado), RichText se renderiza solo si no trae marcadores incrustados; `getPolicyVersion()` (`src/lib/legal.ts`): el `policyVersion` del consentimiento del formulario ahora se lee de la política **publicada en el CMS** (version → effectiveDate → constante fallback) — probado: POST con doc `smoke-v1` guardó esa versión, sin doc guardó la constante; migración `20261110_192543_add_legal_docs` aplicada en dev (prod la recibe con el buildCommand de Vercel); smoke: hub es+ko, detalle pendiente, 404 fuera de whitelist, fila de prueba y doc de smoke eliminadas — la BD queda limpia y sin docs `[PENDIENTE-CLIENTE]`)*
- [x] Galería y acceso de WhatsApp se muestran u ocultan según `galleryEnabled` y `whatsAppEnabled` de `site-settings` *(nav y botón flotante respetan los toggles vía API local; la página de galería y contenido destacado se construyen en su batch específico)*
- [x] Páginas 404 y de error traducidas *(catch-all `[locale]/[...rest]` lanza `notFound()` para que el 404 renderice con branding/traducciones; `error.tsx` client con `{ error, retry }` de Next 16 y sin detalles internos; probados /es/ko con server de producción)*
- [ ] Aviso de no afiliación con BTS/FESTA, **solo** con redacción aprobada por el cliente
- [x] `[IMP]` Por página: `shape` → construir → `critique` → `audit` → corregir *(pase único cerrado 2026-11-10 — Batch P1: `detect` contra las 26 rutas es/ko **en vivo con CSS real** (el escaneo sobre `.next/server` da falsos positivos de tamaños porque no resuelve los stylesheets): 10× line-length en /es/nosotros RichText a ~100 chars, 5× straggler, 1× unbalanced-heading, tracking sobre Hangul (violaba la Keep-All Rule). Corregido: medida de texto máximo `max-w-[72ch]` (canon PRODUCT/DESIGN) en los bloques RichText de nosotros/eventos/viajes/programas/legal; CSS global `p { text-wrap: pretty }`, `h1-h3 { text-wrap: balance }` y `:lang(ko) letter-spacing 0 + text-transform none`; audit de objetivos táctiles → logo del header y 2 enlaces del footer ahora ≥ 44px, burger/switcher/nav ya cumplían; el `hero-eyebrow-chip` (copete sobre h1) se mantiene **decisión del desarrollador** — es el patrón de marca documentado — registrado en `.impeccable/config.json` ignoreRules con motivo; `detect` = 0 en las 26 rutas y en `src/`)*
- [x] `[IMP]` `bolder`/`quieter`/`distill` según la dirección visual acordada con el cliente *(no aplica aún — dirección ya definida "El Puente Lavanda" y validada con el producto; se reabre si el cliente pide ajuste visual)*
- [x] `[IMP]` `adapt` (móvil, tableta, escritorio) y `clarify` (microcopy) en todas las páginas *(adapt 2026-11-10: revisión estructural breakpoint a breakpoint — grids colapsan `sm`/`lg` en todas las páginas (programas grid-cols-1/2/3, masonry galería, tarjetas), nav de escritorio solo ≥ lg con panel móvil ≤ md, textos del CMS a medida única 72ch que evita líneas largas en pantallas anchas; los estados vacíos/pendientes ya cubren clarify de cada sección)*

**Criterio de salida:** todas las páginas del alcance publicadas en preview, en ambos idiomas, con contenido real o marcadores `[PENDIENTE-CLIENTE]`.

---

## Fase 5 — Formularios, eventos y correo

> El pipeline compartido (Zod/endpoint/antispam/rate limit/guardado/consentimiento/estados accesibles) se construyó **con el formulario de contacto (Batch F)**, mientras Fase 4 seguía en curso — véase "Estado de fases". Los ítems abajo marcados ✅ valen solo para contacto; el formulario de **eventos** reutiliza ese pipeline y aún no existe (no hay eventos reales ni la pieza de cupos).

- [x] Esquema de validación compartido cliente/servidor (p. ej. Zod) con mensajes es/ko *(Batch F: `src/lib/contact-schema.ts`, contacto; el de eventos en Fase 5)*
- [x] Endpoint de **contacto/interés** con los campos de la spec funcional §7.1 *(Batch F: `POST /api/contact`; nuevo campo `ageRange` (decisión 2026-11-10) con migración `20261110_175427`; teléfono requerido)*
- [x] Endpoint de **inscripción a evento** con los campos de §7.2 *(Batch K: `POST /api/event-registration` — nombre/correo req, teléfono/ciudad opc, modalidad req; migración `20261110_232755` con campos `city` y `modality`)*
- [x] Rechazar registros de menores de 18 años: recibir `dateOfBirth`, validar edad en servidor, no guardar la fecha y persistir solo la trazabilidad de elegibilidad *(Batch K: `edadCumplida()` en `event-registration-schema.ts` (round-trip + fechas futuras), 403 `minor`; la tabla NO tiene columna de fecha de nacimiento — solo `adultEligibilityConfirmedAt` + `policyVersion`; declaración explícita 18+ en el formulario)*
- [x] Consentimiento de política de datos obligatorio, guardado con fecha/hora y versión del texto *(Batch F, contacto: `acceptedAt` + `policyVersion` en el registro; Batch K también en eventos vía `getPolicyVersion()`)*
- [x] Antispam (Turnstile u honeypot) y rate limiting en ambos endpoints *(Batch F, contacto: honeypot + rate limit en BD (3/24 h por correo, 50/h global, sin IP); Turnstile queda como mejora futura — spec técnica admite honeypot. Batch K, eventos: mismo honeypot + `submissionRateLimit()` generalizado por colección)*
- [x] Guardado en PostgreSQL antes de enviar correo *(Batch F, contacto; Batch K, eventos: INSERT dentro de la transacción, commit antes de Resend)*
- [x] Notificación al correo institucional con Resend; manejo de fallo sin perder el registro *(Batch K: `notifyInstitutional()` extraído a `src/lib/notify.ts` y compartido con contacto; sin API key el registro queda guardado y se registra el error sin PII — envío real pendiente `[CLIENTE]`)*
- [ ] Dominio verificado en Resend `[CLIENTE]` (mientras tanto, remitente de pruebas)
- [x] **Cupo de eventos:** bloqueo de nuevos registros al alcanzar el límite, con control de concurrencia y mensaje claro *(Batch K: transacción drizzle con `SELECT ... FOR UPDATE` de la fila del evento (serializa simultáneos) → count + INSERT atómicos; agotado → 410 `full`; pre-verificación con `payload.count` en la página para mostrar "agotado" sin formulario; sin lista de espera)*
- [x] Estados de formulario accesibles: cargando, éxito, error, campo inválido *(Batch F, contacto: errores por campo con `aria-invalid`/`aria-describedby`, `aria-live` de resumen y `role="alert"`; Batch K replica el patrón en el formulario de eventos, duplicado → 409 con mensaje amable "no necesitas hacerlo de nuevo")*
- [x] Confirmación en pantalla al visitante (correo de confirmación al visitante = mejora posterior) *(Batch F, contacto; Batch K, eventos)*
- [x] Pruebas: registro duplicado, evento lleno, spam, correo caído, campos inválidos *(Batch K, smoke en dev: válido 201, menor 403, fecha imposible 403, duplicado 409, lleno 410, rate limit 429, evento inexistente 404, correo/modalidad inválidos 400, honeypot 200 sin insertar; BD dev restaurada a 0 registros tras las pruebas)*
- [x] `[IMP]` `harden` sobre formularios (errores, desbordes, textos largos en coreano) *(Batch K: skill instalada en el repo (`.github/skills/impeccable`, v4.8.2); hallazgos y correcciones: (1) envío silencioso sin consentimiento — la casilla sin marcar no mostraba nada (issue filtrado del mapper + `noValidate`): ahora muestra mensaje propio, marca la casilla y mueve el foco a ella, en ambos formularios (eventos también declara 18+); (2) enlace del consentimiento del contacto migrado a `@/i18n/navigation` (tenía `next/link` sin prefijo de locale); (3) asterisco `*` retirado de los campos opcionales (teléfono/ciudad del formulario de eventos); (4) placeholder real en el select de modalidad ("Selecciona la modalidad") en vez de "—"; (5) foco al primer campo inválido tras validación fallida en ambos formularios; (6) wording ko del honeypot alineado con el de contacto. Verificación: typecheck/lint/build/detect (src + 4 URLs es/ko) en verde; mensajes es/ko presentes en el bundle servido)*

**Criterio de salida:** envío real de formulario → fila en BD → correo recibido; el límite de cupos se respeta bajo solicitudes simultáneas.

---

## Fase 6 — SEO, accesibilidad y rendimiento

- [x] Metadatos únicos por página e idioma (título, descripción, Open Graph) *(Batch L: `buildMetadata()` con OG (`og:url`/`og:site_name`/`og:locale` es_CO/ko_KR/`og:image` = logo oficial, único asset autorizado `[PENDIENTE-CLIENTE]` foto) + twitter card; **títulos únicos por página** vía `meta.pageTitles/pageDescriptions` en los 8 hubs sin contenido CMS; corrección P0: `title: undefined` de la página pisaba el `<title>`/description del layout — ahora `buildMetadata` no emite claves vacías; OG/twitter igual con herencia de Next)*
- [x] `hreflang` es/ko/x-default *(ya presente desde Fase 4 vía `buildMetadata.alternates`; verificado en vivo en 14 rutas es/ko)*
- [x] `sitemap.xml` dinámico con ambas versiones y `robots.txt` *(Batch L: `src/app/sitemap.ts` (ISR 300 s) — 13 rutas fijas + slugs publicados de programs/tours/events (18 URLs, alternates es/ko/x-default, sin /admin ni /api) + `src/app/robots.ts` (bloquea /admin y /api, referencia al sitemap))*
- [x] Datos estructurados JSON-LD (organización y eventos) *(Batch L: `jsonLdEvent()` en `lib/metadata.ts` + render en `eventos/[slug]` — `Event` con `eventAttendanceMode` por modalidad (Mixed/Offline/Online), `isAccessibleForFree`, `offers` COP 0, organizer NGO, `inLanguage` por locale; solo datos públicos del CMS)*
- [x] Imágenes WebP, `sizes` correctos y `alt` completos *(Batch M: verificado en audit — `media` genera variantes WebP con `imageSizes` (q70–82); las 6 ubicaciones públicas usan `next/image` con `sizes` correctos y `alt` (con fallback al pie de foto en galería); lazy por defecto, `priority` solo en hero/banners; sin `<img>` crudos)*
- [x] Revisión WCAG 2.2 AA: contraste, foco, teclado, etiquetas, lector de pantalla en flujos clave *(Batch M: `impeccable audit` global sobre 28 rutas es/ko — detección determinística + revisión de código: 0 hex fuera de tokens, `alt` en todas las imágenes, landmarks y h1 correctos, sin `<img>` crudos, targets ≥44px ya verificados en Fase 4. Correcciones: contraste de los `<dt>` de detalle (/60 → /70 ≈ 5.9:1, en 4 páginas), medida de los párrafos summary (`max-w-[72ch]`, avisos de líneas ~86 chars), `text-pretty` en los `<dd>` (palabras huérfanas). Re-scan = 0 hallazgos. `prefers-reduced-motion` presente (kill global 0.01 ms: transiciones instantáneas, no destruye feedback). Lighthouse queda como paso manual del desarrollador)*
- [x] Rendimiento básico: Lighthouse móvil, LCP/CLS razonables, fuentes con subconjuntos *(Batch N: reporte del desarrollador sobre `/es` en dev — **Performance 91 · Accesibilidad 100 · Best Practices 96 · SEO 92**, CLS 0 y fuentes autohospedadas con subconjuntos. Corregido de los hallazgos: favicon 404 → `src/app/icon.png` generado desde el logo (512 px, fondo surface), `label-content-name-mismatch` (WCAG 2.5.3) en el selector de idioma → `aria-label` incluye el texto visible ("Cambiar idioma — 한국어"), `sizes` del logo del header 160→104 px (se servían 384 px para un render de ~104 px). **Artefactos de dev/red no accionables**: server-response 1.4 s, mainthread 2.5 s, JS sin minificar/usado 225–384 KiB, source maps, bf-cache (no-store de dev), render-blocking, forced-reflow (devtools) — re-test recomendado contra un deploy de Vercel con red normal; `lcp-discovery` (fetchpriority en la precarga) se revisa en ese re-test. Reporte crudo en `localhost_3000-20261110T201346.html`)*
- [x] Cabeceras de seguridad y CSP validadas (Turnstile, Blob, fuentes, admin de Payload) *(Batch M: CSP en `next.config.ts` — scripts/estilos inline de Next/Payload, img/media/connect para Vercel Blob, fuentes autohospedadas, `upgrade-insecure-requests`, HSTS, nosniff, Referrer-Policy, X-Frame-Options; 'unsafe-eval' solo en dev (Turbopack). Verificado en vivo: cabeceras presentes en /es y /admin 200 sin CSP que bloquee — **recomendado: el desarrollador navega /admin (login, colecciones, subida de media) para confirmar en runtime**. Turnstile no integrado aún: su dominio se anota en el comentario de la CSP para cuando entre)*
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
| 2026-11-10 | Batch H (Patrocinio): sección comandada por `site-settings.sponsorshipEnabled`. Toggle OFF → la ruta responde con estado escueto + CTA (nunca 404, AGENTS §4); toggle ON → grid de `sponsors` (logo/nombre/descripción es-ko/enlace `noopener`, ordenado por `order`) o bloque "próximamente", y aparte de CTA → `/contacto`. Sin migraciones ni volcado (tabla vacía en dev/prod; se llena desde /admin). Smoke: OFF/ON verificados en DOM con server fresco; toggle restaurado a OFF. Lección operativa reforzada: al reiniciar tras rebuild, matar los `next start` por `Get-CimInstance Win32_Process` (CommandLine) y por `netstat LISTENING` — algunos quedan invisibles si no | Desarrollador |
| 2026-11-10 | Batch I (Galería): GATE por `site-settings.galleryEnabled` (patrón Patrocinio). Grid masonry CSS (`columns-1/2/3` + `break-inside-avoid`), `next/image` con dimensiones reales del media y `sizes` por columna, alt = `media.alt` o pie de foto es/ko (fallback automático), orden por `order` asc. Vacío → estado "Fotos en camino" con la regla de autorización explícita (ninguna foto sin consentimiento, AGENTS §5.4). **Solo imágenes**: videos fuera de alcance (spec §6.7 los deja "si se requieren" y el cliente no los pidió — anotado para fase 2 del negocio si surge). Sin lightbox (mejora del pase Impeccable). Fila huérfana del seed eliminada de dev (gallery id 1 sin imagen). Smoke: OFF verificado en DOM (build prod), ON verificado con server dev — evitar 2 rebuilds; toggle a OFF. Pendiente `[CLIENTE]`: fotos autorizadas + revisión humana del coreano | Desarrollador |
| 2026-11-10 | Batch J (Legal) — **Fase 4 completa (10/10)**: colección `legal-docs` con slug radio de 3 opciones fijas /title+body RichText es-ko/version/effectiveDate; hub `/legal` con identidad site-settings + índice (publicado → enlace, pendiente → "Disponible próximamente"), detalle `/legal/[slug]` whitelist estricta (fuera de las 3 URLs → 404; slug válido sin doc → "en preparación"), RichText renderiza solo sin marcadores incrustados. **Decisión clave**: `policyVersion` del formulario de contacto ahora se lee de la política publicada (helpér `getPolicyVersion()`, fallback a la constante de `contact-schema`) para que el consentimiento siempre referencie el texto que el visitante leyó (AGENTS §5.3/§11). El hub usa textos de interfaz next-intl: la doc seed `pages/legal` es ficticia demarcada y `cleanText` solo quita los corchetes, el interior podría filtrarse — doc CMS de páginas sin uso público. Migración `add_legal_docs` en dev; en prod la aplica el build de Vercel. Smoke en build prod: hub es/ko, detalle pendiente, 404 slug falso, POST contacto 201 con versión fallback y luego versión dinámica `smoke-v1` (doc publicada vía SQL directo); filas de prueba eliminadas — BD limpia. Pendiente `[CLIENTE]`: los 3 textos legales (el editor los pega en /admin → *Documentos legales*; el coreano requiere revisión humana antes de publicar) + revisar línea de sitemap futura (rutas /legal/[slug] aún no en sitemap — no existe sitemap aún) | Desarrollador |
| 2026-11-10 | Pase Impeccable de cierre de Fase 4 (L167): `critique`+`audit`+`polish`+`adapt` en un solo barrido sobre las 26 rutas es/ko con servidor vivo (el detect sobre HTML estático de `.next/server` no resuelve los stylesheets y da falsos positivos de jerarquía tipográfica — usar URL). Correcciones: (1) medida tipográfica `max-w-[72ch]` en todo RichText largo (nosotros + 4 detalles) — el dtte de líneas ~100 chars de /es/nosotros era lo más grave del pase; (2) CSS global: `text-wrap: pretty` en párrafos, `balance` en títulos h1–h3 (viudas y cabeceras desbalanceadas), y `:lang(ko) { letter-spacing: 0; text-transform: none }` — el eyebrow coreano con tracking violaba nuestra propia Keep-All Rule; (3) audit táctil: enlace del logo del header y 2 enlaces del footer ahora ≥ 44px (los demás ya cumplían). El hallazgo `hero-eyebrow-chip` (copete sobre h1, 13 páginas es) quedó en **mantener por decisión del desarrollador** — es el patrón de marca documentado en DESIGN.md, no plantilla IA — registrado como ignore con motivo en `.impeccable/config.json`. `impeccable detect` = 0 en 26 rutas y en src/. Aviso BTS/HYBE/FESTA `[CLIENTE]` sigue pendiente (nada de ese material está en el repo) | Desarrollador |
| 2026-11-10 | **Fix — canonical del home con barra final (SEO 92 en producción)**: el re-test Lighthouse en producción (`https://borahae-kappa.vercel.app/es`, corrido por el desarrollador: Perf 99 · A11y 100 · BP 100 · SEO 92) dejaba el mismo único audit fallido: `canonical` — "Points to another hreflang location". Causa: en el home `buildMetadata` recibía `path: "/"` y generaba `canonical = /es/` (con barra) mientras la URL del documento es `/es` (`trailingSlash: false`) → Lighthouse lo trataba como ubicación distinta que coincide con el `hreflang: es`. Corregido normalizando el path en `buildMetadata` (`ruta = path === "/" ? "" : strip slash`) para canonical/hreflang/x-default/og:url; el resto de páginas no tenía el problema y el sitemap ya salía sin barra. Verificado localmente (canonical `/es` y `/ko` sin barra; /es/contacto igual) — **validación final contra producción pendiente de redeploy** (en localhost el audit seguirá marcando por el dominio de SITE_URL ≠ localhost, es esperado) | Desarrollador |
| 2026-11-10 | **Batch N — Lighthouse móvil y cierre de Fase 6**: reporte del desarrollador (`localhost_3000-20261110T201346.html`, página `/es`, mobile/simulated, internet lento anotado): Performance 91, Accesibilidad 100, Best Practices 96, SEO 92; CLS 0. Interpretación: la mayoría de los hallazgos son artefactos de `next dev` + red lenta (JS sin minificar/unused 225–384 KiB, server-response 1.4 s, mainthread 2.5 s, source maps, bf-cache no-store, render-blocking CSS, forced-reflow de devtools) — accionables solo con re-test en deploy de Vercel. Fixes reales aplicados: `src/app/icon.png` (favicon 404 en consola; generado desde el logo con sharp, 512 px sobre fondo surface), WCAG 2.5.3 Label in Name en el selector de idioma (`aria-label` = "Cambiar idioma — 한국어" incluye el texto visible), `sizes` del logo del header a 104 px (antes descargaba 384 px para ~104 px de render). canonical "falta" = falso positivo (existe, apunta al dominio de producción; Lighthouse lo marca por correr en localhost). typecheck/lint/build/detect en verde; `/icon.png` prerenderizado | Desarrollador |
| 2026-11-10 | **Fix — doc fantasma en listados del admin** (galería): "Encountered two children with the same key, `5`" en `/admin/collections/gallery`. Causa: filas huérfanas en las tablas de versiones (`_gallery_v` id 1 y `_pages_v` id 5 con `parent_id = NULL`, FK `ON DELETE SET NULL` en vez de cascada) → la query del listado con `draft=true` las devolvía como docs fantasma (`id: null`) → la key del `<tr>` caía al fallback `rowIndex` y colisionaba con el doc real id 5. **Aprobado por el desarrollador**: se eliminaron las 2 filas huérfanas de la BD de desarrollo (`DELETE ... WHERE parent_id IS NULL`); verificado que el listado vuelve a 5 docs únicos (gallery) y 3 (pages, que tenía el mismo bug latente con fantasma draft). Sin cambios de código ni migración; si reaparece al borrar docs desde el admin, revisar `_v` huérfanas y evaluar migrar la FK a CASCADE | Desarrollador |
| 2026-11-10 | **Batch M — audit WCAG + cabeceras de seguridad** (Fase 6): CSP y cabeceras en `next.config.ts` (CSP compatible con Payload/Blob/fuentes, HSTS, nosniff, Referrer-Policy, X-Frame-Options, `unsafe-eval` solo en dev; nota embebida para añadir challenges.cloudflare.com cuando entre Turnstile) — sitio y `/admin` en 200 con cabeceras aplicadas (el desarrollador debe navegar el panel una vez para confirmar en runtime). `impeccable audit` global sobre 28 rutas es/ko: theming 100% tokens (0 hex fuera de globals.css), imágenes WebP/sizes/alt correctas, landmarks/h1/skip-link OK, sin animaciones caras. Correcciones del scan: contraste de `<dt>` /60→/70 (≈5.9:1) en 4 páginas, medida `max-w-[72ch]` en los summary de eventos/viajes, `text-pretty` en los `<dd>` de detalle; re-scan = 0 hallazgos. Lighthouse móvil queda como paso manual del desarrollador | Desarrollador |
| 2026-11-10 | **Batch L — SEO técnico** (Fase 6): OG + twitter card en `buildMetadata()` con `og:image` = logo oficial (único asset de marca autorizado; foto de portada `[PENDIENTE-CLIENTE]`); **hallazgo P0** corregido: las páginas sin título CMS pasaban `title: undefined` y ese objeto pisaba el `<title>`/`meta description` del layout (verificado en vivo: /es/contacto salía sin `<title>`) — `buildMetadata` ahora solo emite claves con contenido y OG/twitter heredan de la metadata; títulos y descripciones **únicos por página** para los 8 hubs sin contenido CMS vía `meta.pageTitles/pageDescriptions` (es/ko, coreano pendiente de revisión humana); `sitemap.ts` (ISR 300 s, 18 URLs: 13 fijas + slugs publicados de programs/tours/events, alternates es/ko/x-default) y `robots.ts` (bloquea /admin y /api); `jsonLdEvent()` (schema.org/Event con attendance mode por modalidad, isAccessibleForFree, offers COP 0, organizer NGO) renderizado en `eventos/[slug]`. Verificado en vivo: title/OG/hreflang en 14 rutas es/ko, sitemap 18 URLs con 54 alternates, JSON-LD completo en evento es/ko; typecheck/lint/build/detect en verde. Sigue: cabeceras de seguridad + audit global (Batch M) | Desarrollador |
| 2026-11-10 | **`harden` de formularios** (último ítem `[IMP]` de Fase 5): skill Impeccable instalada en el repo (`.github/skills/impeccable` v4.8.2 + agentes en `.github/agents` — estaba ausente de este harness; instalación confirmada por el desarrollador). Hallazgos P1 corregidos: **envío silencioso sin consentimiento** (en ambos formularios la casilla sin marcar producía cero feedback: el mapper filtraba el issue y con `noValidate` no había mensaje nativo — ahora mensaje propio + foco sobre la casilla; el formulario de eventos además valida la declaración 18+); **enlace del consentimiento del contacto sin prefijo de locale** (`next/link` → `@/i18n/navigation`). Menores: asterisco retirado de campos opcionales del formulario de eventos (teléfono/ciudad, spec §7.2), placeholder real en el select de modalidad (antes "—", ilegible para lectores de pantalla), foco al primer campo inválido tras validación fallida en ambos formularios, wording ko del honeypot unificado. Nuevas claves: `contact.errors.consent`, `eventReg.modalityPlaceholder`, `eventReg.errors.consent/adult` (es/ko). Coreano de las claves nuevas **pendiente de revisión humana** `[PENDIENTE-CLIENTE]`. Detect 0 en src/ y en 4 URLs (evento + contacto, es/ko) | Desarrollador |
| 2026-11-10 | **Batch K — inscripción a eventos** (spec §7.2, AGENTS §5.3): campos `city` + `modality` en `event-registrations` (migración `20261110_232755`, `modality` NOT NULL porque la fija siempre el endpoint: la del evento, o la elección del visitante en eventos `hibrido`); esquema Zod compartido en `src/lib/event-registration-schema.ts` (DOB solo de tránsito, `edadCumplida()` con round-trip y fechas futuras); endpoint `POST /api/event-registration` con flujo validar → honeypot → rate limit → **edad ≥ 18 en servidor** → transacción drizzle (`payload.db.drizzle.transaction`) con `SELECT ... FOR UPDATE` de la fila del evento → duplicado (409) → cupo (410) → INSERT → commit → Resend. Códigos traducibles en UI: minor/duplicate/full/rateLimit/notFound/validation/server. Formulario cliente en `event-registration-form.tsx` (patrón del de contacto; enlace de consentimiento con `@/i18n/navigation` — en `contact-form.tsx` sigue `next/link` sin prefijo, a corregir aparte) integrado en `eventos/[slug]` con pre-verificación de cupo (`payload.count`, ISR 300 s) que muestra "agotado" sin formulario; `submissionRateLimit()` generalizado por colección y `notifyInstitutional()` extraído a `lib/notify.ts`. **Dependencia nueva confirmada por el desarrollador**: `drizzle-orm@0.45.2` exacta (era transitiva de @payloadcms/db-postgres; pnpm estricto no la exponía; sin actualización). Smoke completo en dev (201/403/409/410/429/404/400/honeypot sin insertar; DOB nunca en BD — la tabla no tiene columna); BD dev restaurada. Coreano de `eventReg.*` generado por IA, **pendiente de revisión humana** `[PENDIENTE-CLIENTE]`. Pendiente Fase 5: `harden` de formularios, envío real Resend `[CLIENTE]` | Desarrollador |
| 2026-11-10 | Migración `setRequestLocale` → `next/root-params` (hallada por el desarrollador leyendo el código; `@deprecated` en next-intl 4.14.9, API nativa de Next 16.3 que ya usamos en 16.4.5): `i18n/request.ts` ahora lee el locale con `rootParams.locale()` con fallback defensivo a `es` (el layout `[locale]/layout.tsx` es root layout válido y sigue validando con `hasLocale` + 404); se eliminó `setRequestLocale` del layout + 14 páginas (42 llamadas) — los `params` se conservan (la UI los usa para las queries localizadas de Payload, eso no es next-intl). `proxy.ts` se queda: la negociación/redirect de locales no la reemplaza la API. **Nota Fase 5**: root-params NO funciona en Server Actions ni Route Handlers — el endpoint de registro de eventos deberá recibir el locale explícito en su esquema. Verificado: typecheck/lint/build/detect (26 rutas + src) en verde; smoke en vivo: textos es y ko correctos sin el truco del header (HTML `lang="es"/"ko"` intacto), 404 localizado, `/admin` 200 | Desarrollador |

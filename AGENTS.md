# AGENTS.md — Sitio web BORAHAE

Guía para agentes de código (y para humanos) que trabajen en este repositorio. Léela completa antes de modificar código. Si algo aquí contradice una petición puntual del desarrollador, gana la petición; si contradice las especificaciones, avisa y pregunta.

## 1. Qué es este proyecto

Sitio institucional **bilingüe (español / coreano)** de BORAHAE, una ESAL de intercambio cultural Colombia–Corea del Sur. Presenta la organización, programas (curso de coreano, becas, talleres), viajes, eventos gratuitos con inscripción **solo para mayores de 18 años**, galería, donaciones (enlace PayPal / datos de transferencia), patrocinio y contacto. El representante legal edita contenido desde `/admin`.

Documentos fuente (si hay conflicto, pregunta; no decidas solo):

- `docs/Especificacion_Web_Borahae.md` — alcance funcional.
- `docs/Especificacion_Tecnica_Borahae.md` — arquitectura y stack.
- `PRODUCT.md` / `DESIGN.md` — contexto de producto y de diseño usados por Impeccable.
- `ROADMAP.md` — fases y checklist. **Es la fuente de verdad del progreso.**

Plazo de referencia: 10 días. Desarrollador único. Prioriza lo que está en alcance; no inventes funcionalidades.

## 2. Stack

| Capa | Tecnología |
| --- | --- |
| App | Next.js (App Router) + TypeScript estricto |
| Estilos | Tailwind CSS 4 con tokens en `@theme` |
| CMS | Payload CMS (instalado dentro de la app Next, panel en `/admin`) |
| BD | PostgreSQL en Neon (adaptador Postgres de Payload) |
| Archivos | Vercel Blob |
| Hosting | Vercel (`main` = producción, `dev` + PRs = previews) |
| Correo | Resend |
| i18n de interfaz | next-intl |
| i18n de contenido | Payload Localization (`es`, `ko`) |
| CI | GitHub Actions |

Antes de añadir cualquier dependencia nueva, justifícala y confirma con el desarrollador. Fija versiones compatibles entre Next.js y Payload; no actualices mayores sin pedirlo.

## 3. Comandos

Entorno de desarrollo: **Windows** (IntelliJ IDEA). Escribe scripts y comandos que funcionen en PowerShell y bash; evita utilidades solo-Unix en `package.json` (usa `cross-env`, `rimraf`, etc. si hace falta).

```bash
pnpm install --frozen-lockfile   # instalación reproducible (o npm ci si el repo usa npm)
pnpm dev                         # servidor local
pnpm typecheck                   # tsc --noEmit
pnpm lint                        # eslint (flat config)
pnpm build                       # compilación de producción
pnpm generate:types              # regenerar payload-types.ts (payload --use-swc)
pnpm payload:migrate:create      # nueva migración tras cambiar colecciones
pnpm payload:migrate             # aplicar migraciones
npx payload --use-swc <cmd>      # cualquier otro comando del CLI de Payload
npx impeccable detect src/       # detector de "AI slop" (exit code 2 = hallazgos)
```

> **Nota:** los comandos del CLI de Payload van con `--use-swc` porque `tsx@4.23.15`
> (fijado por payload 3.93) choca con `undici` y aborta con "Illegal constructor".
> Revisar al actualizar payload.

Ajusta los nombres reales de scripts al `package.json` cuando exista y mantén esta sección actualizada.

**Definición de "terminado" para cualquier cambio:** `typecheck`, `lint` y `build` pasan; si tocaste UI, también `impeccable detect` sin hallazgos nuevos; y la casilla correspondiente de `ROADMAP.md` queda marcada.

## 4. Estructura esperada

```text
src/
  app/
    (frontend)/[locale]/        # sitio público: /es y /ko
      page.tsx
      nosotros/ programas/ viajes/ eventos/ galeria/
      donaciones/ patrocinio/ contacto/ legal/
    (payload)/admin/            # panel de Payload
    api/                        # endpoints de formularios (con rate limit)
    sitemap.ts  robots.ts
  collections/                  # users, pages, programs, tours, events,
                                # event-registrations, contact-submissions,
                                # media, gallery, sponsors
  globals/                      # site-settings
  components/                   # UI reutilizable
  i18n/                         # config y mensajes de next-intl
  lib/                          # utilidades (email, validación, rate limit)
  styles/globals.css            # @import "tailwindcss" + @theme
messages/ es.json  ko.json      # textos fijos de interfaz
docs/                           # especificaciones del cliente
.impeccable/                    # archivos de la skill (ver sección 7)
```

Mantén la separación: **textos fijos de interfaz → next-intl**; **contenido editable → Payload Localization**. No mezcles.

### Rutas públicas definitivas

Todas las rutas existen bajo los prefijos `/es` y `/ko`; los ejemplos siguientes usan español. Los *slugs* se mantienen en español también bajo `/ko` para simplificar el mantenimiento y preservar URLs estables.

```text
/es
/es/nosotros
/es/programas
/es/programas/curso-coreano
/es/programas/becas
/es/programas/talleres
/es/viajes
/es/viajes/[slug]
/es/eventos
/es/eventos/[slug]
/es/galeria
/es/donaciones
/es/patrocinio
/es/contacto
/es/legal
/es/legal/politica-de-tratamiento-de-datos
/es/legal/terminos-y-condiciones
/es/legal/condiciones-de-viaje
```

`/patrocinio`, `/galeria` y el botón de WhatsApp pueden ocultarse o mostrarse desde `site-settings`; la ruta no debe devolver error cuando una sección esté desactivada. La sección de condiciones de viaje se publica solo cuando el cliente apruebe dicho contenido.

## 5. Reglas de implementación

### 5.1 Internacionalización
- Rutas siempre con prefijo: `/es/...` y `/ko/...`. Español es el idioma por defecto; `/` redirige a `/es`.
- El coreano hace *fallback* al español si un campo no está traducido.
- El *matcher* del middleware de next-intl **debe excluir** `/admin`, `/api`, `/_next` y archivos estáticos.
- Metadatos únicos por página e idioma, `hreflang` (es, ko, x-default), sitemap con ambas versiones.
- Los textos en coreano se generan con apoyo de IA y **requieren revisión humana antes de publicarse**, sobre todo legal, pagos y condiciones de viaje. Marca claramente en el CMS lo no revisado; nunca publiques traducciones legales sin aprobación.
- Verifica que las fuentes rendericen Hangul, tildes y ñ correctamente.

### 5.2 Payload CMS
- Roles: `admin` (desarrollador) y `editor` (representante legal). Aplica control de acceso **a nivel de colección y de campo**; el editor no puede tocar usuarios, estructura ni configuración técnica.
- `contact-submissions` y `event-registrations`: lectura solo para admin y editor autorizado; **nunca expuestas por la API pública**. Creación solo desde el endpoint de servidor.
- Esquema controlado por **migraciones**. No uses modo `push` contra la base de producción.
- Regenera `payload-types.ts` después de cada cambio de esquema y no edites ese archivo a mano.
- Hooks de revalidación: al publicar contenido, revalida las rutas afectadas en ambos idiomas.
- `site-settings` debe incluir interruptores editables para `galleryEnabled`, `sponsorshipEnabled` y `whatsAppEnabled`, además del número/enlace de WhatsApp. El menú, las llamadas a la acción y las rutas públicas deben respetar estos interruptores.

### 5.3 Formularios (contacto y eventos)
Flujo obligatorio: validar (cliente **y** servidor, mismo esquema, p. ej. Zod) → verificar antispam (Turnstile o honeypot) → rate limit → guardar en PostgreSQL → enviar notificación con Resend → responder al visitante.
- Consentimiento de la política de tratamiento de datos es obligatorio y se guarda con fecha/hora y versión del texto aceptado.
- Pide solo los datos estrictamente necesarios.
- Si el correo falla, el registro **no se pierde**: ya está guardado; registra el error y no muestres detalles internos al visitante.
- **Cupos de eventos:** el límite es opcional por evento. Valida y crea el registro en una sola transacción (o con bloqueo/constraint) para evitar sobrepasar el cupo por solicitudes simultáneas. Mensaje claro cuando se agota. Sin lista de espera.
- **Edad mínima:** los registros a eventos de la fase 1 son exclusivamente para personas de **18 años o más**. Solicita `dateOfBirth` solo en la petición, calcula la edad en servidor y rechaza cualquier solicitud de menor de edad. No persistas la fecha de nacimiento: guarda únicamente `adultEligibilityConfirmedAt` y el resultado de validación. Incluye una declaración explícita de mayoría de edad. Esto es una comprobación declarativa, no verificación de identidad; no solicites documentos de identidad sin una nueva definición legal del cliente.
- Mensajes de validación traducidos (es/ko) y accesibles (asociados al campo, anunciados a lectores de pantalla).

### 5.4 Imágenes y archivos
- Publicar en **WebP**, tamaños adaptados por componente; nunca originales pesados en la interfaz pública.
- Usa `next/image` con `sizes` correctos y `alt` siempre (editable por idioma en el CMS).
- Binarios en Vercel Blob; en PostgreSQL solo referencias y metadatos.
- Limita tipos y tamaño en la configuración de `media`. No subas imágenes sin autorización de uso del cliente.

### 5.5 Seguridad
- Secretos solo en variables de entorno (Vercel / `.env.local`). **Nunca** en el repo. Mantén un `.env.example` sin valores reales.
- Usa la conexión **pooled** de Neon para `DATABASE_URL` en serverless; verifica la configuración de pool.
- No registres datos personales en logs.
- Cabeceras de seguridad razonables (CSP compatible con Turnstile, Vercel Blob y fuentes), sin romper el admin de Payload.
- Sanitiza cualquier contenido enriquecido que se renderice.
- Enlaces externos con `rel="noopener noreferrer"`.

### 5.6 Rendimiento y SEO
- Prefiere Server Components; `"use client"` solo donde haya interactividad real.
- Páginas públicas estáticas/ISR cuando sea posible; contenido dinámico (eventos, cupos) con revalidación adecuada.
- Datos estructurados JSON-LD para organización y eventos.
- Cada página: un solo `h1`, jerarquía de encabezados correcta.

## 6. Diseño y accesibilidad

La misión de BORAHAE incluye **inclusión y accesibilidad**; trátalo como requisito, no como extra. Objetivo: **WCAG 2.2 nivel AA**.

Tokens (definidos con `@theme` en Tailwind 4; no uses hex sueltos en componentes):

| Token | Valor | Uso |
| --- | --- | --- |
| `borahae-surface` | `#F7F1FB` | Fondo principal |
| `borahae-primary` | `#603C94` | Títulos, enlaces, botones, pie |
| `borahae-secondary` | `#B58CDA` | Acentos y detalles **decorativos** |
| `borahae-primary-hover` | `#4D2F78` | Hover/foco del primario |
| `borahae-text` | `#241832` | Texto |

- **Contraste:** `borahae-secondary` sobre `borahae-surface` está por debajo de 3:1. **No lo uses para texto ni para bordes/íconos que transmitan información.** Úsalo en fondos, ilustración y detalles decorativos. Verifica cada combinación nueva.
- Tipografía: **Noto Serif KR** (títulos y frases destacadas) y **Noto Sans KR** (texto, menús, formularios, botones), en ambos idiomas. Carga con `next/font`, con subconjuntos y `display: swap`.
- Foco visible en todos los elementos interactivos, navegación completa por teclado, objetivos táctiles ≥ 44 px, respeto de `prefers-reduced-motion`.
- Estilo: minimalista, institucional y cultural. Móvil primero.
- Los textos en coreano suelen requerir ajustes de interlineado y de `word-break` (`keep-all`); pruébalos.

### Marca BTS / FESTA
BORAHAE TRIP hace referencia al fenómeno ARMY/BTS. **No uses logos, imágenes, música ni material de BTS/HYBE/FESTA sin confirmación escrita del cliente** sobre permisos y sobre cómo indicar que no hay afiliación oficial. Ante la duda, no lo incluyas y deja un `TODO` en `ROADMAP.md`.

## 7. Uso de Impeccable

Skill de diseño: <https://github.com/pbakaus/impeccable>. Instalación y flujo para este repo:

```bash
npx impeccable install      # desde la raíz; acepta el hook de diseño
# recarga tu herramienta de agente, luego:
/impeccable init            # genera/actualiza PRODUCT.md
/impeccable document        # genera DESIGN.md (cuando ya existan tokens/componentes)
```

(En Codex se invoca como `$impeccable`.)

**Cuándo usar cada comando en este proyecto**

| Momento | Comando |
| --- | --- |
| Antes de construir una página nueva | `/impeccable shape <página>` |
| Tras tener tokens y fuentes | `/impeccable document` |
| Ajustes de dirección visual | `bolder`, `quieter`, `distill`, `typeset`, `layout`, `colorize` |
| Revisión de una sección | `critique <sección>` (UX) y `audit <sección>` (técnico/a11y) |
| Antes de cada entrega parcial | `polish`, `adapt` (pantallas), `optimize` |
| Antes de publicar | `harden` (errores, i18n, desbordes, casos límite) y `clarify` (microcopy) |
| Patrones repetidos | `extract` |

Reglas:
- **Apunta a objetivos estrechos** (una sección o componente), no a sitios completos.
- **Contexto primero:** `PRODUCT.md` y `DESIGN.md` se mantienen en el repo y se leen antes de cualquier trabajo visual. Si los tokens cambian, actualiza `DESIGN.md`.
- Los hallazgos **P0/P1** del `audit` bloquean el cierre de una fase.
- `/impeccable harden` es obligatorio para revisar textos largos en coreano, desbordes y estados de error.
- El hook revisa cada archivo de UI que se edite; **no lo desactives**. Si un hallazgo es un falso positivo, regístralo con `npx impeccable ignores add-value ... --reason "..."` o un comentario `impeccable-disable`, siempre con motivo.
- **Live mode** (`/impeccable live`) solo contra el servidor local. No lo inyectes en previews ni producción, ni relajes la CSP para que funcione.
- **Versionado:** mantén en git `PRODUCT.md`, `DESIGN.md`, `.impeccable/config.json`, `.impeccable/design.json`, `.impeccable/surfaces/*.md` y `.impeccable/critique/*.md`. Copia al `.gitignore` el bloque `# impeccable-ignore-start … end` del README de la skill.
- **Telemetría:** al ser un proyecto de cliente, el desarrollador decidirá si la desactiva (`npx impeccable telemetry off` o `DO_NOT_TRACK=1`). No envía código ni `PRODUCT.md`.
- **CI:** añade un paso `npx impeccable detect --github src/` y trata el exit code `2` como fallo (o advertencia, según decida el desarrollador).
- Si algo falla: `/impeccable doctor`.

Impeccable ayuda a evitar los "tics" de diseño generado por IA (gradientes morado-azul genéricos, tarjetas anidadas, íconos en cuadrados redondeados sobre cada título, etc.). La paleta de BORAHAE es morada **por ser la marca**: úsala con criterio propio, no como gradiente por defecto.

## 8. Git y flujo de trabajo

- Ramas: `dev` (trabajo) y `main` (producción). Cambios a `main` **solo por Pull Request** desde `dev`.
- Commits pequeños, en imperativo, con prefijo convencional (`feat:`, `fix:`, `chore:`, `docs:`, `style:`).
- GitHub Actions debe pasar: instalación reproducible, `typecheck`, `lint`, `build` (y `impeccable detect` si se activa).
- Revisa el preview de Vercel antes de fusionar.
- Un cambio = una intención. No mezcles refactors con funcionalidades.
- Al terminar una tarea: marca la casilla en `ROADMAP.md` y anota en una línea cualquier decisión relevante.

### Flujo obligatorio para tickets solicitados al agente

Cuando el desarrollador pida, por ejemplo, “ejecuta el primer ticket de la fase 3”, el agente **no debe modificar archivos inmediatamente**. Debe:

1. Leer `AGENTS.md`, `PRODUCT.md`, `ROADMAP.md` y los archivos relevantes al ticket.
2. Presentar un plan breve y concreto: objetivo, archivos a crear/cambiar, decisiones técnicas, migraciones, pruebas y riesgos. Si el ticket depende de una decisión pendiente, señalarla.
3. Esperar el visto bueno explícito del desarrollador.
4. Tras recibirlo, implementar únicamente el ticket aprobado. No ampliar el alcance ni añadir dependencias sin autorización.
5. Añadir o actualizar pruebas cuando el cambio tenga comportamiento verificable. Como mínimo, ejecutar `typecheck`, `lint` y `build`; para cambios de UI, ejecutar también Impeccable según esta guía. Ejecutar y reportar las pruebas específicas añadidas.
6. Actualizar la casilla y el registro de decisiones de `ROADMAP.md`.
7. Entregar un resumen de cambios, archivos relevantes, comandos de verificación y sus resultados, riesgos o pendientes, y **un nombre de commit sugerido en inglés** con formato convencional, por ejemplo `feat: add localized event collection`.

El agente no debe crear commits, hacer `push` ni abrir Pull Requests salvo instrucción explícita. El desarrollador revisa el cambio, usa el mensaje propuesto y crea el PR.

## 9. Fuera de alcance (fase 1) — no lo implementes

Pasarela de pagos o cuotas, inscripción formal a viajes, tiquetes/QR/asistencia, lista de espera, área de miembros, app móvil, analítica avanzada, automatizaciones de marketing, mantenimiento posterior a la entrega. Si surge la necesidad, anótala en la sección "Fase 2" del roadmap y pregunta.

## 10. Cuándo detenerte y preguntar

- Falta contenido o dato del cliente (textos legales, NIT, correo institucional, PayPal, logo): usa un marcador claro (`[PENDIENTE-CLIENTE]`) y continúa; **no inventes** datos legales, precios ni condiciones de viaje.
- Hay conflicto entre las dos especificaciones.
- Una decisión implica coste recurrente, cambia el alcance o afecta a datos personales.
- Vas a borrar datos, migrar esquema en producción o tocar variables de entorno de producción.

## 11. Protección de datos personales

El sitio recoge datos de personas (nombre, correo, teléfono y, para eventos, fecha de nacimiento usada solo en memoria para comprobar mayoría de edad) bajo la normativa colombiana de protección de datos. El **texto legal, plazo de conservación y canal de solicitudes los aprueba el cliente**; el código solo debe: pedir el mínimo necesario, exigir consentimiento explícito, guardarlo con trazabilidad y no exponer registros públicamente. La fase 1 no admite registros de menores de edad.

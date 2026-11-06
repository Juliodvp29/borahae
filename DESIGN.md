---
name: BORAHAE
description: Sitio institucional bilingüe (es/ko) de intercambio cultural Colombia–Corea del Sur
colors:
  primary: "#603C94"
  primary-hover: "#4D2F78"
  secondary: "#B58CDA"
  neutral-bg: "#F7F1FB"
  neutral-text: "#241832"
typography:
  display:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  label:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.1em"
rounded:
  lg: "8px"
  xl2: "16px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  card:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.xl2}"
    padding: "24px"
---

# Design System: BORAHAE

## Overview

**Creative North Star: "El Puente Lavanda"**

BORAHAE es un puente lavanda: dos culturas (Colombia y Corea del Sur) que se tocan gracias a una firma visual mínima — la barra de acento Wisteria, que atraviesa el contenido y no se repite en ningún otro elemento de la página. La identidad vive en la tipografía (Noto Serif KR de vocación institucional) y en el morado orquídea; no usa imágenes sin autorización del cliente ni material fan de ningún tipo.

Espaciado generoso y ritmo sereno; un solo fondo lavanda (Bruma) sostiene la lectura en cualquier página. Todo lo decorativo es superficie de `secondary` y nunca transmite información.

**Key Characteristics:**
- Botones pill (cápsula con objetivo táctil mínimo de 44 px)
- Una barra de acento Wisteria por página, en el hero; nunca texto
- Bilingüe estructural: el coreano tiene reglas propias en el CSS global (`:lang(ko)`)
- Foco global visible (`:focus-visible` con contorno Orquídea)
- Cero gradientes decorativos

## Colors

La paleta es una progresión de orquídea: una familia morada de baja saturación con una superficie lavanda aireada.

### Primary
- **Orquídea Principal** (#603C94): títulos, enlaces, botones primarios, footer completo. Es el morado del logo oficial. Contraste 7.36:1 sobre la superficie.
- **Orquídea Profunda** (#4D2F78): estado hover/focus de botones primarios.

### Secondary
- **Wisteria** (#B58CDA): exclusivamente decorativa — barra de acento del hero, divisores, ilustración. Nunca texto, íconos, ni bordes que transmitan información (no pasa 3:1).

### Neutral
- **Bruma Lavanda** (#F7F1FB): fondo global (surface).
- **Uva Tinta** (#241832): texto del cuerpo y títulos. 13.2:1 sobre la superficie.
- **Blanco** (#FFFFFF): texto sobre Orquídea (8.2:1), fondo de tarjetas.

### Named Rules
**The Decorative Wisteria Rule.** #B58CDA nunca porta significado. Si un color transmite estado, ubicación o jerarquía, es Orquídea o Uva Tinta. La única excepción es la barra de acento — y por eso es una, no muchas.

## Typography

**Display Font:** Noto Serif KR (fallback Georgia, serif)
**Body Font:** Noto Sans KR (fallback system-ui, sans-serif)

**Character:** serif institucional con calidez coreana; sans utilitaria y amable. Ambas familias cargan Hangul (unicode-range on-demand).

### Hierarchy
- **Display** (600, `text-3xl`→`text-5xl`, `leading-snug/tight`, vía `font-display`): h1 del home y h2 de sección (SectionHeading). Máximo una h1 por página.
- **Title** (600, `text-2xl`→`text-3xl`, 1.35): encabezados intermedios.
- **Body** (400, `text-base`→`text-lg`, 1.625–1.75, máximo 72ch): texto corrido.
- **Label** (500, `text-sm`, `tracking-widest`, uppercase — solo latino): copetes de sección, navegación.

### Named Rules
**The Keep-All Rule.** El coreano nunca se rompe palabra por palabra: `:lang(ko) { word-break: keep-all; line-height: 1.77 }` ya está en el CSS global y es norma. Tampoco `tracking-widest` ni `uppercase` sobre texto coreano.

## Layout

Contenedor central `max-w-6xl` (1152 px) con `px-6` laterales. Header sticky de `h-16`. Hero del home: `py-24 md:py-32`. La deuda móvil前列 es el estándar: diseño mobile-first, el nav de escritorio se revela en `lg` (1024 px) — cambiar el breakpoint sin revisar es/ko está fuera de debate hasta que el audit lo verifique.

## Elevation & Depth

Sistema **plano-tonal**: la profundidad se transmite con capas tonales (`border-borahae-primary/10`, blanco sobre Bruma) sin sombras. Solo dos superficies tienen sombra (`shadow-sm`): la tarjeta `Card` y el panel del menú móvil, porque se superponen al contenido.

### Shadow Vocabulary
- **elemento flotante** (`shadow-sm`): tarjeta Card, panel de menú móvil. Nunca botones.

### Named Rules
**The Flat-By-Default Rule.** Sin sombra al reposo. Las sombras aparecen solo sobre elementos flotantes; el hover se expresa con cambio de fondo, no con elevación.

## Shapes

Radio coherente: `rounded-full` para CTAs (pill de 44 px), `rounded-lg` (8 px) para items de navegación y chips, `rounded-2xl` (16 px) para tarjetas. Separadores horizontales de 1 px a baja opacidad (`border-borahae-primary/10`; `border-white/20` en el footer). La firma geométrica del sistema es la **barra de acento**: `border-l-4 border-borahae-secondary` alineada a la izquierda del hero — el epicentro del "puente".

## Components

### button-primary (`ui/button.tsx`)
Pill 44 px: fondo Orquídea, texto blanco, hover Orquídea Profunda. El foco usa el contorno global. Nunca en el footer (allí el fondo ya es Orquídea).

### button-outline (`ui/button.tsx`)
Pill 44 px: borde Orquídea 1 px, texto Orquídea, hover Orquídea Profunda con texto blanco. Nunca sobre fondo Orquídea ni texto corto decorativo.

### card / SectionHeading (`ui/*`)
Card: blanco, borde hairline, esquinas 16 px, `p-6`, altura natural — no estirar. SectionHeading: copete Label uppercase + h2 Display serif con `mt-2`.

### header (`site/header.tsx`)
Sticky sobre `bg-borahae-surface`, borde inferior hairline, `h-16`. Escritorio (≥ `lg`): nav de 9 items; la página actual lleva `aria-current="page"` (Orquídea + semibold). Móvil: burger 44 px, panel cierra con Escape (devuelve foco al botón).

### footer (`site/footer.tsx`)
Orquídea completa, texto blanco (8.2:1; niveles secundarios con opacidad ≥ 80 % para mantener contraste). Estructura: columna de identidad + columna de acceso (contacto, legal).

### language switcher (`site/language-switcher.tsx`)
Pill con borde Orquídea y texto del idioma **destino** en su propia escritura (한국어 / Español). Cambia a la misma ruta en el otro locale, sin perder la ubicación.

## Do's and Don'ts

### Do's
- Darle a cada página una única h1 Display serif en Uva Tinta.
- Mantener los pares de contraste documentados en `src/styles/globals.css` como canon; al añadir una combinación nueva, registrarla.
- Usar `Link` de `@/i18n/navigation` (prefijo de idioma) para todo enlace interno.
- Aplicar la barra Wisteria máximo una vez por página.

### Don'ts
- **No** usar gradientes morado-azulados, tarjetas anidadas ni iconitos en cuadritos sobre títulos (antirreferencia: plantilla IA).
- **No** poner texto, íconos o bordes informativos en Wisteria (#B58CDA).
- **No** cargar imágenes sin autorización del cliente ni material BTS/HYBE/FESTA sin permiso escrito.
- **No** aplicar `tracking-widest`/`uppercase` a texto coreano.
- **No** estirar tarjetas a alturas iguales artificiales.

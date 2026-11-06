---
target: shell bilingüe (header/footer/home)
total_score: 29
max_score: 40
na_heuristics: 5,9,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\julio\\Documents\\Dev\\nextjs\\borahae\\src\\app\\(frontend)\\[locale]\\page.tsx"
target_fingerprint: "sha256:82d1e898731e70f9c0a9ff03e67a87d3cbd1578bd85131a0293f363b49e6f74b"
target_path: "C:\\Users\\julio\\Documents\\Dev\\nextjs\\borahae\\src\\app\\(frontend)\\[locale]\\page.tsx"
timestamp: 2026-11-06T19-39-42Z
slug: src-app-frontend-locale-page-tsx
---
#### Report header provenance

`Method: dual-agent (A: ses_e4da29502ffevdGpiHcLQNDjYo · B: ses_e4da294feffecMaKb3hVDGyNF2)` — sin automatización de navegador disponible; Assessment B solo CLI de fuentes (sin overlay visual).

Target: shell público `src/app/(frontend)/[locale]/page.tsx` (+ layout, header/footer/switcher/ui, globals.css).

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Sin indicación de página actual en la nav |
| 2 | Match System / Real World | 3 | Switcher de idioma no se lee como control |
| 3 | User Control and Freedom | 3 | Menú móvil no cierra por tap fuera ni mueve el foco |
| 4 | Consistency and Standards | 4 | Targets 44px, foco global, idioms consistentes |
| 5 | Error Prevention | n/a | No hay formularios en el shell (Fase 5) |
| 6 | Recognition Rather Than Recall | 2 | 9 elementos de igual peso, sin estado activo |
| 7 | Flexibility and Efficiency | 2 | CTAs del home duplican la nav en vez de deep-linking |
| 8 | Aesthetic and Minimalist Design | 3 | Limpio; eyebrow duplicado + hero como andamio |
| 9 | Error Recovery | n/a | Sin estados de error aún |
| 10 | Help and Documentation | n/a | Nada requiere documentación |
| **Total** | | **29/40** (20/28 aplicables, normalizado) | **Good — base sólida, jerarquía y identidad flojos** |

#### Design Specificity Verdict

**LLM assessment:** Category-interchangeable with good bones. Quiten el wordmark y esto puede publicarse para cualquier pequeña ONG de cualquier país. Auténtico lo tiene: tokens morados propiamente documentados, Noto Serif/KR, keep-all/1.77, arquitectura bilingüe (client islands solo donde interactivo). Falta: presencia colombiana, textura coreana, composición que solo BORAHAE justifique. Síntoma claro: `--color-borahae-secondary` está definido y **nunca se usa** — toda la capa decorativa de la marca está ausente. Disciplina sin carácter = plantilla con QA.

**Deterministic scan:** Limpio en ambas corridas (`src/app/(frontend)/[locale]` y `src/components`): 0 hallazgos, exit 0. El detector no capturó nada que el review LLM también viera — sin falsos positivos que anotar. Concuerda en expresar que no hay "slop" (gradientes genéricos, tarjetas anidadas, iconitos en cuadros) — el shell es honesto, solo llano.

**Visual overlays:** No disponibles en esta sesión (sin herramientas de navegador). Señal de fallback: el detector de fuentes corrió completo (16 archivos) y la verificación de contraste quedó documentada en `globals.css`.

#### Overall Impression

Como estructura, está muy por encima del promedio: a11y estructural (skip-link con target enfocable, foco global, tokens documentados). Como *diseño de BORAHAE*, recién empieza: la única marca visible es la tipografía. La mayor oportunidad: convertir el hero en una prueba del posicionamiento "integrador único" — el visitante no puede percibir hoy que esta única ESAL contiene curso + viaje a Seúl + eventos gratuitos + inclusión.

#### What's Working

1. **A11y estructural, no cosmética** — skip-link, targets 44px (`min-h-11/size-11`) en todo, `:focus-visible` global único: las páginas futuras heredan cumplimiento gratis.
2. **Higiene de tokens con memoria institucional** — `globals.css` documenta por qué cada par pasa AA y cercala el secundario decorativo.
3. **Paridad bilingüe por construcción** — switcher preserva la ruta; ko marcado `__review` pendiente de validación humana.

#### Priority Issues

**[P1] Sin indicación de página actual en navegación** — `header.tsx:44-52`, sin `aria-current="page"` ni estilo activo; en una nav de 9 elementos la ubicación es la señal de orientación más usada (afecta a Jordan, Casey y Sam). **Fix:** extraer `NavLink` client que use `usePathname` y aplique `aria-current="page"` + `text-borahae-primary font-semibold`; equivalente en el panel móvil. *Comando sugerido: /impeccable layout o fix directo.*

**[P1] Nav de escritorio probable overflow en 768–1024px** — `header.tsx:32-63`: en `md` (768px) el nav activa mientras MobileNav se oculta; 9 etiquetas es + wordmark + pill ≈ más ancho disponible. Flex encogerá los chips y envolverá etiquetas a dos líneas justo en tablets pequeñas (viewport Casey). **Fix:** `hidden md:block`→`hidden lg:block` (menú hasta 1024px), y verificar en browser con es y ko. Estimación del análisis: confirmar visualmente.

**[P1] Especificidad: cero textura de marca más allá de la tipografía** — home hero como campo lavanda sin composición; `borahae-secondary` sin uso; eyebrow `BORAHAE` duplica el wordmark del header 80px arriba. **Fix (sin imágenes aún):** eyebrow bilingüe `Colombia · Corea del Sur / 콜롬비아 · 대한민국` en `page.tsx:19-21`; banda/tab divisor decorativo con `borahae-secondary` como superficie pura; priorizar un slot de fotografía en el hero cuando lleguen imágenes (Fase 4).

**[P2] Menú móvil sin tap-fuera y sin foco dentro** — `mobile-nav.tsx:69-89`: sin backdrop, tap en página no cierra; abrir deja foco en el botón. **Fix:** backdrop de `<button aria-label={closeLabel}>` fijo full-screen bajo el panel; (opcional) foco al primer enlace al abrir, a validar con usuarios SR.

**[P2] Switcher de idioma se lee comobadge decorativo** — `language-switcher.tsx:17-25`: pill con texto del otro idioma, sin ícono ni indicio de acción; además falta `hrefLang`. **Fix:** SVG globito 16px `aria-hidden` + `hrefLang={other}`; mantener texto del idioma destino.

**[P3] Año del footer congelado en build** — `footer.tsx:12` con `new Date()` en servidor estático: puede quedar viejo al cruzar año bajo ISR. **Fix:** aceptar año de build o revalidar el footer.

**[P3] Hover muerto/conflictivo en variante outline del botón** — `button.tsx:14`: `hover:bg-borahae-primary/10 hover:bg-borahae-primary-hover` — el segundo gana; decidir tint o flip.

#### Persona Red Flags

- **Jordan (primera vez):** el home contesta "quién eres" en 5s pero no "qué puedo hacer" — los 2 CTAs duplican la nav en vez de enlazar a lo diferencial (curso coreano, calendario de eventos). El viaje a Seúl, el activo más distintivo, está a 3 niveles de nav.
- **Casey (móvil):** casi el mejor servido (targets, sticky, Escape+foco) y casi lo arruina el overflow 768–1024 sin verificar y el no-tap-fuera; ambos se sienten en los primeros 30 segundos.
- **Sam (lector de pantalla):** el mejor servido — pero sin `aria-current` no confirma su ubicación tras navegar; el menú móvil no migra el foco al abrir; el footer reexpone solo 2 de 9 destinos sin motivo explícito.

#### Minor Observations

- `Card` y `SectionHeading` definidos y sin uso todavía (ok si Fase 4 los usa; estandarizar el patrón copete al corregir el eyebrow del home).
- tracking-widest uppercase en Latin solo — no aplicar tracking a texto coreano (no ocurre hoy).
- id `contenido-principal` técnica pero estable — no depender del locale en estilizados.
- `onieButton` ring `outline-borahae-text` diverge del ring global primario — verificar en ambos contextos cuando se use en header/footer.

#### Questions to Consider

- ¿Qué elemento — no texto — de este shell dice "Colombia–Corea"? Si solo es la tipografía, hay paleta, no marca.
- ¿Dónde se *muestra* la inclusión (foto, gesto visual) en vez de afirmarse?
- ¿Cuál es la tarea de 30 segundos en móvil y por qué los CTAs del home no apuntan exactamente ahí?

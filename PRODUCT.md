# PRODUCT.md — BORAHAE

> Borrador inicial preparado a partir de las especificaciones v1.0 (5 nov 2026). Impeccable lee este archivo antes de cada comando de diseño. Ejecuta `/impeccable init` para que la skill lo contraste con el código y te haga las preguntas que falten; luego ajusta lo marcado con `[CONFIRMAR]`.

## Qué es

Sitio web institucional bilingüe (español / coreano) de BORAHAE, una ESAL que promueve el intercambio cultural entre Colombia y Corea del Sur a través del Hallyu, la gastronomía, el idioma y la sociedad coreana.

## Para quién

Personas interesadas en la cultura coreana: aprendices del idioma, aficionadas al Hallyu y a la comunidad ARMY, viajeras, posibles voluntarias, aliados y patrocinadores. Navegan sobre todo desde el celular. Hay visitantes hispanohablantes y coreanohablantes. La navegación pública está abierta a todo público; los registros a eventos de la fase 1 son solo para mayores de 18 años.

## Qué debe lograr

1. Explicar con claridad quién es BORAHAE, su misión y su enfoque inclusivo.
2. Dar visibilidad a programas (curso de coreano, becas, talleres), eventos y viajes (BORAHAE TRIP 2027, Seúl, 6–21 de junio, 25 personas).
3. Permitir inscribirse gratis a eventos y contactar a la organización.
4. Facilitar donaciones (PayPal / transferencia) y atraer patrocinio.
5. Que el representante legal actualice contenido sin ayuda del desarrollador.
6. Permitir que el representante legal active o desactive Galería, Patrocinio y el acceso a WhatsApp sin pedir cambios de código.

## Misión y visión (resumen)

Difundir la cultura coreana construyendo un espacio de aprendizaje y conexión **inclusivo, accesible y seguro**, que valore la diversidad y permita participar en igualdad de condiciones. Aspira a ser referente colombo-coreano de intercambio cultural e inclusión social.

## Personalidad y tono

Minimalista, institucional y cultural; cálido y acogedor, no corporativo frío ni "fan-site" recargado. Elegante y legible. Texto claro, directo y respetuoso, en español neutro de Colombia y en coreano formal-cortés `[CONFIRMAR registro]`.

## Identidad visual

- Paleta: superficie `#F7F1FB`, primario `#603C94`, secundario `#B58CDA` (decorativo), hover `#4D2F78`, texto `#241832`. Derivada del logo oficial.
- Tipografía: Noto Serif KR (títulos y frases destacadas) y Noto Sans KR (texto, menús, formularios, botones).
- El morado es la marca; debe sentirse deliberado y no como un gradiente morado genérico.

## Principios de diseño

1. **Accesibilidad como requisito** (WCAG 2.2 AA): contraste, foco visible, teclado, objetivos táctiles amplios, movimiento reducido.
2. **Móvil primero.**
3. **Bilingüe de verdad:** el coreano no es una traducción "pegada"; el diseño debe sostener ambos idiomas (longitudes, interlineado, salto de palabra).
4. **Poco, bien hecho:** jerarquía clara, espacio, pocas decoraciones.
5. **Confianza:** es una organización que pide datos y donaciones; la información legal y el tratamiento de datos son visibles y claros.

## Anti-referencias (evitar)

- Estética de merchandising de fandom o uso de material de BTS/HYBE sin permiso.
- Gradientes morado-azul genéricos, tarjetas dentro de tarjetas, íconos en cuadrados redondeados sobre cada título.
- Tipografías por defecto de "plantilla" y fotos de stock sin relación con Colombia–Corea.
- Texto sobre `#B58CDA` o combinaciones de bajo contraste.
- Estereotipos culturales y tratamiento folclorizante de Corea o Colombia.

## Restricciones

- Presupuesto y plazo ajustados (10 días, desarrollador único); alcance de la fase 1 cerrado (ver especificaciones).
- Contenido e imágenes los entrega el cliente; las imágenes deben tener autorización de uso.
- Los eventos de la fase 1 son gratuitos y solo admiten registros de mayores de 18 años. La edad se valida en servidor sin conservar la fecha de nacimiento.
- Galería, Patrocinio y WhatsApp son secciones configurables: pueden estar ocultas hasta que el cliente decida activarlas.
- No hay pagos integrados, ni área de miembros, ni inscripción formal a viajes en la fase 1.
- Referencias a BTS/FESTA solo con permisos y aviso de no afiliación aprobados por el cliente.
- Stack: Next.js, Tailwind CSS 4, Payload CMS, next-intl (ver `AGENTS.md`).

## Superficies principales

Inicio · Nosotros · Programas (curso de coreano, becas, talleres) · Viajes · Eventos (con inscripción) · Galería · Donaciones · Patrocinio · Contacto · Legal.

## Éxito

El representante legal puede mantener el sitio solo; una visitante entiende qué es BORAHAE en segundos, se inscribe a un evento o escribe en menos de un minuto, y el sitio se ve propio y cuidado en ambos idiomas.

# Especificación técnica — Sitio web BORAHAE

**Versión:** 1.0  
**Fecha:** 5 de noviembre de 2026  
**Estado:** Definición técnica inicial

## 1. Propósito

Este documento define la arquitectura, tecnologías, integraciones, seguridad, despliegue y responsabilidades técnicas del sitio web institucional bilingüe de BORAHAE. Complementa la especificación funcional del proyecto.

## 2. Stack tecnológico

| Capa | Tecnología | Uso |
| --- | --- | --- |
| Aplicación web | Next.js | Sitio público, rutas, renderizado y endpoints de servidor |
| Lenguaje | TypeScript | Tipado y mantenimiento del código |
| Estilos | Tailwind CSS | Diseño responsivo y sistema visual propio |
| CMS | Payload CMS | Panel administrativo, usuarios, contenido, archivos y API |
| Base de datos | PostgreSQL | Contenido, usuarios, formularios, eventos e inscripciones |
| Alojamiento de base de datos | Neon | PostgreSQL administrado en la nube |
| Archivos multimedia | Vercel Blob | Imágenes, banners y otros archivos aprobados |
| Hosting y despliegue | Vercel | Publicación, variables de entorno y entornos de vista previa |
| Correo transaccional | Resend | Envío de notificaciones de formularios |
| Internacionalización de interfaz | next-intl | Rutas por idioma y textos fijos de la interfaz |
| Localización de contenido | Payload Localization | Contenido editable en español y coreano |
| Control de versiones | GitHub + GitHub Actions | Repositorio, validaciones y automatización de despliegue |

## 3. Arquitectura

```text
Visitante
  ↓
Next.js alojado en Vercel
  ├─ Sitio público: /es y /ko
  ├─ Panel de contenido: /admin
  ├─ Formularios y registros
  └─ API de Payload CMS
          ↓
    PostgreSQL en Neon
          ↓
    Vercel Blob (imágenes y banners)

Formulario enviado
  ├─ Se guarda en PostgreSQL
  └─ Envía notificación con Resend al correo institucional
```

## 4. Entornos y ramas

| Entorno | Rama | Propósito |
| --- | --- | --- |
| Desarrollo | `dev` | Desarrollo y pruebas internas |
| Producción | `main` | Versión aprobada y publicada |

- El desarrollo se realizará en la rama `dev`.
- Los cambios aprobados se integrarán en `main` mediante un Pull Request.
- Cada cambio enviado a GitHub podrá generar una vista previa en Vercel antes de su publicación.
- GitHub Actions ejecutará las validaciones definidas antes de aceptar o desplegar cambios.

## 5. Gestión de contenido

Payload CMS ofrecerá un panel administrativo en `/admin`.

### Roles de usuario

| Rol | Responsable | Permisos principales |
| --- | --- | --- |
| Administrador | Desarrollador | Configuración técnica, usuarios, estructura, despliegue, mantenimiento de base de datos e integraciones |
| Editor | Representante legal | Crear y editar contenido, banners, imágenes, programas, eventos, tours y páginas autorizadas |

No se implementará un área privada para miembros en la fase 1.

### Colecciones y contenido previsto

- `users`: usuarios del panel y roles.
- `pages`: páginas institucionales y bloques editables.
- `programs`: curso de coreano, becas y talleres.
- `tours`: viajes, itinerarios, inclusiones, exclusiones, precios y condiciones informativas.
- `events`: eventos presenciales, virtuales o híbridos.
- `event-registrations`: registros de asistentes a eventos.
- `contact-submissions`: contactos de interés, voluntariado, alianzas, donaciones y patrocinio.
- `media`: imágenes, banners y archivos autorizados.
- `gallery`: elementos publicados en la galería.
- `site-settings`: logo, datos de contacto, redes sociales, donaciones, navegación y configuración institucional.
- `sponsors`: patrocinadores y aliados cuando se active la sección.

## 6. Idiomas e internacionalización

El sitio estará disponible en español y coreano.

### Rutas públicas

```text
/es
/es/nosotros
/es/programas
/es/viajes
/es/eventos

/ko
/ko/nosotros
/ko/programas
/ko/viajes
/ko/eventos
```

- `next-intl` administrará las rutas y los textos fijos de interfaz, como menú, botones, formularios y mensajes de validación.
- Payload Localization almacenará los textos editables para los locales `es` y `ko`.
- Cada registro de contenido tendrá campos localizables: título, descripción, contenido, metadatos SEO y campos pertinentes.
- El idioma predeterminado será español. El coreano tendrá respaldo al español si un campo aún no ha sido traducido.
- La traducción se preparará con apoyo de IA y deberá revisarse antes de su publicación, con especial atención a textos legales, pagos y condiciones de viaje.

## 7. Diseño y sistema visual

### Paleta institucional

| Token | Color | Uso |
| --- | --- | --- |
| `borahae-surface` | `#F7F1FB` | Fondo principal y secciones suaves |
| `borahae-primary` | `#603C94` | Títulos, enlaces, botones principales y pie de página |
| `borahae-secondary` | `#B58CDA` | Acentos, etiquetas, fondos secundarios y detalles |
| `borahae-primary-hover` | `#4D2F78` | Estado de interacción del color principal |
| `borahae-text` | `#241832` | Texto oscuro para asegurar legibilidad |

### Tipografía

- **Títulos y frases destacadas:** Noto Serif KR.
- **Texto, menús, formularios y botones:** Noto Sans KR.
- Las dos tipografías se usarán en español y coreano para mantener una identidad consistente y compatibilidad con Hangul, tildes y ñ.

### Tailwind CSS 4

Los tokens se definirán mediante `@theme` en los estilos globales:

```css
@import "tailwindcss";

@theme {
  --color-borahae-surface: #F7F1FB;
  --color-borahae-primary: #603C94;
  --color-borahae-secondary: #B58CDA;
  --color-borahae-primary-hover: #4D2F78;
  --color-borahae-text: #241832;
}
```

## 8. Imágenes y archivos

- Las imágenes aportadas por el cliente se convertirán y publicarán preferentemente en formato **WebP** para optimizar carga y peso.
- Se usarán tamaños y resoluciones adaptados a cada componente; no se cargarán imágenes originales de gran tamaño en la interfaz pública.
- Vercel Blob almacenará los archivos; PostgreSQL almacenará solo la información y referencias necesarias.
- Se aceptarán únicamente formatos y tamaños que se definan en la configuración de medios.
- Las imágenes deberán contar con autorización de uso proporcionada por el cliente.
- Se utilizará el componente de imagen optimizada de Next.js cuando aplique.

## 9. Formularios y correos

### Contacto e interés

El formulario general recibirá, como mínimo:

- Nombre completo.
- Edad o rango de edad.
- Correo electrónico.
- Número de contacto.
- Motivo de contacto.
- Mensaje.
- Consentimiento obligatorio de política de tratamiento de datos.

### Inscripción a eventos

El formulario de eventos gratuitos recibirá, como mínimo:

- Nombre completo.
- Correo electrónico.
- Número de contacto opcional.
- Ciudad opcional.
- Modalidad de asistencia cuando aplique.
- Consentimiento obligatorio de política de tratamiento de datos.

### Flujo de envío

1. El visitante completa el formulario.
2. El sistema valida los datos y la aceptación de la política.
3. El registro se guarda en PostgreSQL.
4. El sistema envía una notificación al correo institucional mediante Resend.
5. Opcionalmente, se muestra al visitante una confirmación en pantalla. El correo de confirmación al visitante podrá evaluarse como mejora posterior.

El cliente deberá crear el correo institucional y verificar el dominio para habilitar el envío confiable de correos.

## 10. Eventos y límites de cupo

- Los eventos serán gratuitos durante la fase 1.
- Cada evento podrá ser presencial, virtual o híbrido.
- No habrá pagos ni generación de tiquetes en la fase 1.
- El límite de cupos será **opcional y configurable por evento**.
- Si un evento tiene límite activo, el sistema deberá dejar de aceptar nuevos registros cuando se alcance el número definido y mostrar un mensaje claro al visitante.
- La lista de espera automática queda fuera del alcance inicial, salvo que se apruebe específicamente.

## 11. Donaciones

- La fase 1 incluirá un botón o enlace a PayPal cuando el cliente entregue una cuenta configurada.
- Se podrá publicar información de transferencia bancaria o llave Bre-B cuando el cliente la suministre.
- No se integrará inicialmente una pasarela de pagos, cobro de cuotas ni procesamiento directo de pagos dentro del sitio.

## 12. Seguridad y protección

### Medidas incluidas

- HTTPS administrado por Vercel.
- Variables de entorno para secretos, credenciales y claves; no se almacenarán en el repositorio.
- Autenticación y permisos gestionados por Payload CMS.
- Cuenta de administrador restringida al desarrollador y cuenta de editor restringida al representante legal.
- Validación de formularios en cliente y servidor.
- Política de tratamiento de datos con consentimiento obligatorio.
- Rate limiting o mecanismo equivalente en endpoints de formularios, según la configuración de despliegue.
- Protección antispam sin costo recurrente, preferiblemente Cloudflare Turnstile o un honeypot. Se aplicará la alternativa compatible con el despliegue y las necesidades del formulario.

### Gestión de datos personales

- Los formularios guardarán los datos estrictamente necesarios para el propósito informado.
- El texto legal, tiempo de conservación y canal para solicitudes de datos deberán ser entregados y aprobados por el cliente.
- El cliente será responsable de la aprobación jurídica de sus políticas y términos.

## 13. SEO técnico

El proyecto incluirá una base técnica sólida para posicionamiento orgánico. Esto no garantiza una posición específica en buscadores, ya que el posicionamiento depende también de contenido, competencia, enlaces, autoridad y evolución de los motores de búsqueda.

### Incluido

- Estructura semántica de encabezados y contenido.
- Metadatos únicos por página y por idioma: título, descripción y Open Graph.
- Sitemap XML dinámico.
- Archivo `robots.txt`.
- Etiquetas `hreflang` para español y coreano.
- URLs limpias bajo `/es/...` y `/ko/...`.
- Imágenes WebP optimizadas, atributos `alt` y carga adaptada.
- Diseño responsive y rendimiento optimizado.
- Datos estructurados cuando sean pertinentes para organización y eventos.

### Dependencias del cliente

- Textos finales de calidad en ambos idiomas.
- Imágenes con nombres y descripciones adecuadas.
- Revisión de títulos, descripciones y contenido de cada página.
- Validación de la información institucional y legal.

## 14. Base de datos, archivos y copias de seguridad

- PostgreSQL será alojado en Neon.
- La conexión se realizará mediante `DATABASE_URL`, almacenada como variable de entorno en Vercel.
- El esquema será administrado por Payload y sus migraciones.
- Los archivos multimedia residirán en Vercel Blob, no en la base de datos.
- Se configurarán y revisarán las opciones de respaldo y retención disponibles en las cuentas del cliente.
- Antes de actualizaciones estructurales importantes se deberá respaldar la información necesaria.

## 15. Despliegue

### Vercel

- El repositorio se conectará a Vercel.
- La rama `main` desplegará producción.
- La rama `dev` y Pull Requests podrán generar vistas previas de prueba.
- Las variables de entorno se configurarán separadamente para desarrollo, vista previa y producción cuando sea necesario.
- El dominio del cliente se conectará al proyecto mediante configuración DNS.

### Cuentas y propiedad

Las cuentas de dominio, Vercel, Neon, Resend, PayPal y cualquier servicio de terceros deberán crearse preferiblemente a nombre del cliente. El desarrollador recibirá acceso técnico necesario para configurar y desplegar el proyecto.

## 16. Automatización con GitHub Actions

Antes de integrar o desplegar cambios, GitHub Actions podrá ejecutar como mínimo:

- Instalación reproducible de dependencias.
- Validación de tipos de TypeScript.
- Linter.
- Compilación de producción.

Pruebas automatizadas adicionales podrán incorporarse según el avance del proyecto.

## 17. Pruebas de aceptación técnica

Antes de la entrega se verificarán:

1. Visualización correcta en móvil, tableta y escritorio.
2. Navegación en español y coreano.
3. Cambio de idioma y rutas correspondientes.
4. Panel de administración y permisos por rol.
5. Creación y edición de contenido, imágenes, eventos y tours.
6. Guardado de formularios en PostgreSQL.
7. Envío de notificaciones al correo institucional, una vez configurado.
8. Límite opcional de cupos por evento.
9. Protección antispam y validaciones de formularios.
10. Carga de imágenes WebP y rendimiento básico.
11. Metadatos, sitemap, robots y etiquetas de idioma.
12. Despliegue de producción bajo el dominio final.

## 18. Fuera del alcance inicial

- Pagos integrados, cuotas o financiación.
- Gestión de reservas o inscripción formal a viajes.
- Tiquetes, códigos QR o control de asistencia.
- Lista de espera automatizada para eventos.
- Área privada para miembros.
- Aplicación móvil.
- Analítica avanzada y automatizaciones de marketing.
- Mantenimiento recurrente posterior a la entrega.

## 19. Mantenimiento y cambios posteriores

El desarrollo incluye la entrega de la primera versión acordada y una guía básica para que el editor pueda administrar contenido.

No se incluye mantenimiento mensual, actualizaciones periódicas, soporte continuo ni desarrollo de nuevas funcionalidades después de la entrega. Cualquier corrección fuera del periodo de garantía acordado, actualización técnica, cambio de contenido que requiera intervención del desarrollador o nueva funcionalidad se evaluará y cotizará como trabajo adicional.

## 20. Pendientes del cliente antes de producción

1. Dominio y acceso DNS.
2. Correo institucional creado.
3. Cuenta de PayPal y/o datos de donación alternativos.
4. Cuentas y enlaces definitivos de redes sociales.
5. Logo, textos finales e imágenes autorizadas.
6. Datos legales: razón social, NIT, ciudad, contacto y política de datos.
7. Condiciones de viaje, precio y cancelaciones, si se publica esa información.
8. Decisión final sobre botón de WhatsApp.
9. Revisión y aprobación de las traducciones al coreano.


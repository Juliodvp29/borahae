import type { Field } from 'payload'

/**
 * Campos SEO reutilizables y localizados (AGENTS.md §5.1):
 * título y descripción por idioma + imagen OG (usa el tamaño 'og' de media).
 * Sin pestañas propias: se encajan al final del esquema de cada colección.
 */
export function seoFields(): Field[] {
  return [
    {
      name: 'seoTitle',
      type: 'text',
      localized: true,
      label: 'Título SEO',
      admin: {
        description: 'Aparece en resultados de búsqueda y pestañas. Si queda vacío se usa el título normal. Máximo 60.',
      },
      validate: (value: string | null | undefined) => {
        if (value && value.length > 60) {
          return `Máximo 60 caracteres; el navegador cortará el texto largo (${value.length}).`
        }
        return true
      },
    },
    {
      name: 'seoDescription',
      type: 'text',
      localized: true,
      label: 'Descripción SEO',
      admin: {
        description: 'Máximo 160 caracteres; recomendado 140–160 para un buen extracto.',
      },
      validate: (value: string | null | undefined) => {
        if (value && value.length > 160) {
          return `Máximo 160 caracteres; el buscador cortará el texto largo (${value.length}).`
        }
        return true
      },
    },
    {
      name: 'seoImage',
      type: 'upload',
      label: 'Imagen de redes (OG)',
      relationTo: 'media',
    },
  ]
}

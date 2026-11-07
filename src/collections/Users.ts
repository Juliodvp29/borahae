import type { CollectionConfig } from 'payload'
import { adminOnly } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    // Los usuarios solo se administran desde el rol admin (access.adminOnly).
    useAsTitle: 'email',
    description: 'Cuentas del panel. Solo el administrador (desarrollador) crea cuentas.',
  },
  auth: true,
  access: {
    // Nadie externo; solo el propio usuario autenticado via auth de Payload.
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
    admin: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cuenta',
          fields: [
            {
              name: 'role',
              type: 'select',
              label: 'Rol',
              required: true,
              defaultValue: 'editor',
              options: [
                {
                  label: 'Admin (desarrollador)',
                  value: 'admin',
                },
                {
                  label: 'Editor (representante legal)',
                  value: 'editor',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

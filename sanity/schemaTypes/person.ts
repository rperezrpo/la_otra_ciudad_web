import { defineType, defineField } from 'sanity'

export const person = defineType({
  name: 'person',
  title: 'Persona',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
    }),
    defineField({
      name: 'state',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Activo', value: 'active' },
          { title: 'Inactivo', value: 'inactive' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Controla el orden en que aparece el equipo (menor primero).',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})

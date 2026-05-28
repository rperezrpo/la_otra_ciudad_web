import { defineType, defineField } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Hábitat', value: 'Hábitat' },
          { title: 'Educación', value: 'Educación' },
          { title: 'Cultura', value: 'Cultura' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'summary',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      description: 'Texto corto para las tarjetas de proyecto.',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'neighborhood',
      title: 'Territorio',
      type: 'string',
    }),
    defineField({
      name: 'partners',
      title: 'Aliados',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Activo', value: 'activo' },
          { title: 'Completado', value: 'completado' },
        ],
        layout: 'radio',
      },
      initialValue: 'activo',
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'featured',
      title: 'Destacado en inicio',
      type: 'boolean',
      description: 'Si está activo, aparece en la portada.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'heroImage' },
  },
})

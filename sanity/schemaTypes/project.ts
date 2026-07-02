import { defineType, defineField } from 'sanity'

// Las categorías guardan una CLAVE estable; el label visible por idioma vive en
// src/i18n/categories.ts (CATEGORY_META). Así una traducción sirve para todos
// los documentos.
const CATEGORY_OPTIONS = [
  { title: 'Paisajes Regenerativos',      value: 'paisajes-regenerativos' },
  { title: 'Espacio Público',             value: 'espacio-publico' },
  { title: 'Acompañamiento Comunitario',  value: 'acompanamiento-comunitario' },
]

const PT_BLOCK = {
  type: 'block' as const,
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2',     value: 'h2'     },
    { title: 'H3',     value: 'h3'     },
  ],
  marks: {
    decorators: [
      { title: 'Negrita', value: 'strong' },
      { title: 'Cursiva', value: 'em'     },
    ],
    annotations: [
      {
        title: 'Enlace',
        name: 'link',
        type: 'object' as const,
        fields: [{ title: 'URL', name: 'href', type: 'url' as const }],
      },
    ],
  },
  lists: [
    { title: 'Lista', value: 'bullet' },
  ],
}

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'object',
      fields: [
        defineField({ name: 'es', title: 'Español', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'en', title: 'English', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title.es', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categoria_principal',
      title: 'Categoría principal',
      type: 'string',
      options: { list: CATEGORY_OPTIONS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: CATEGORY_OPTIONS,
        layout: 'grid',
      },
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
      description: 'Texto corto para las tarjetas de proyecto.',
      type: 'object',
      fields: [
        defineField({ name: 'es', title: 'Español', type: 'text', rows: 3 }),
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'object',
      fields: [
        defineField({ name: 'es', title: 'Español', type: 'array', of: [PT_BLOCK] }),
        defineField({ name: 'en', title: 'English', type: 'array', of: [PT_BLOCK] }),
      ],
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
    select: { title: 'title.es', subtitle: 'categoria_principal', media: 'heroImage' },
  },
})

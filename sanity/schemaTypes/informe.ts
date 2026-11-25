import { defineType, defineField } from 'sanity'

// Informes anuales de sostenibilidad (Régimen Tributario Especial).
// Se publican en /sostenibilidad: la portada es la tarjeta y el archivo se abre
// en un visor de PDF.
export const informe = defineType({
  name: 'informe',
  title: 'Informe',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: (r) => r.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'cover',
      title: 'Portada',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'file',
      title: 'Archivo (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: 'Año (reciente primero)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { year: 'year', media: 'cover' },
    prepare: ({ year, media }) => ({ title: year ? `Informe ${year}` : 'Informe sin año', media }),
  },
})

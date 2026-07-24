import { defineType, defineField } from 'sanity'

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
      name: 'email',
      title: 'Correo (Google Workspace)',
      type: 'string',
      description:
        'Correo @laotraciudad.org con el que la persona inicia sesión para editar su propio perfil. No se muestra en el sitio público.',
      validation: (r) =>
        r.regex(/@laotraciudad\.org$/i, {
          name: 'correo corporativo',
          invert: false,
        }),
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
      name: 'links',
      title: 'Enlaces',
      description: 'LinkedIn, ORCID u otros enlaces externos que aparecen en la página individual.',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'type',
            title: 'Tipo',
            type: 'string',
            options: {
              list: [
                { title: 'LinkedIn', value: 'linkedin' },
                { title: 'ORCID', value: 'orcid' },
                { title: 'Otro', value: 'custom' },
              ],
              layout: 'radio',
            },
            initialValue: 'custom',
            validation: (r) => r.required(),
          }),
          defineField({
            name: 'label',
            title: 'Etiqueta (solo para tipo "Otro")',
            type: 'string',
            validation: (r) =>
              r.custom((label, context: any) => {
                if (context.parent?.type === 'custom' && !label) {
                  return 'La etiqueta es obligatoria para enlaces de tipo "Otro".';
                }
                return true;
              }),
          }),
          defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
        ],
        preview: {
          select: { type: 'type', label: 'label', url: 'url' },
          prepare({ type, label, url }: any) {
            const presetLabels: Record<string, string> = { linkedin: 'LinkedIn', orcid: 'ORCID' };
            return { title: presetLabels[type] ?? label ?? 'Enlace', subtitle: url };
          },
        },
      }],
    }),
    defineField({
      name: 'longBio',
      title: 'Biografía extendida',
      description:
        'Texto completo para la página individual de la persona. Si se deja vacío, se usa la Biografía corta de arriba.',
      type: 'object',
      fields: [
        defineField({ name: 'es', title: 'Español', type: 'array', of: [PT_BLOCK] }),
        defineField({ name: 'en', title: 'English', type: 'array', of: [PT_BLOCK] }),
      ],
    }),
    defineField({
      name: 'researchAreas',
      title: 'Áreas de interés / investigación',
      description: 'Etiquetas cortas para la página individual (ej. "Vivienda popular").',
      type: 'object',
      fields: [
        defineField({ name: 'es', title: 'Español', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Proyectos relacionados',
      description: 'Proyectos de LOC en los que ha participado esta persona.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({
      name: 'cv',
      title: 'CV (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
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
    defineField({
      name: 'canEditProjects',
      title: '¿Puede editar proyectos?',
      type: 'boolean',
      description:
        'Si está activo, esta persona puede editar cualquier proyecto desde /proyectos/editar.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})

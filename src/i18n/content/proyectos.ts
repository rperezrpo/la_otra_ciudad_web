export const proyectosContent = {
  es: {
    metaTitle: 'Proyectos',
    metaDescription: 'Un recorrido por los proyectos de La Otra Ciudad en el territorio.',
    heroEyebrow: 'Proyectos',
    heroTitle: 'Un recorrido por nuestro trabajo en el territorio',
    heroSub: 'Desde el hábitat hasta la cultura, nuestros proyectos son procesos de larga duración construidos con y para las comunidades.',
    stats: [
      // Mismos agregados que home.ts — ver la derivación comentada allí.
      ['1.265+', 'm² de espacio público'],
      ['641',    'Plantas nativas sembradas'],
      ['21',     'Talleres con comunidades'],
      ['2021',   'Año de fundación'],
    ] as [string, string][],
    ctaEyebrow: 'Apoya el trabajo',
    ctaTitle: '¿Quieres ser parte de nuestros proyectos?',
    ctaText: 'Tu donación financia directamente proyectos como estos en comunidades de Medellín.',
  },
  en: {
    metaTitle: 'Projects',
    metaDescription: "A tour of La Otra Ciudad's projects across the territory.",
    heroEyebrow: 'Projects',
    heroTitle: 'A tour of our work in the territory',
    heroSub: 'From habitat to culture, our projects are long-term processes built with and for communities.',
    stats: [
      ['1,265+', 'm² of public space'],
      ['641',    'Native plants planted'],
      ['21',     'Workshops with communities'],
      ['2021',   'Year founded'],
    ] as [string, string][],
    ctaEyebrow: 'Support the work',
    ctaTitle: 'Want to be part of our projects?',
    ctaText: 'Your donation directly funds projects like these in communities across Medellín.',
  },
} as const;

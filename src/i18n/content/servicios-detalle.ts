// Contenido de las 3 subpáginas de servicios, por clave estable de categoría.
import type { CategoryKey } from '../categories';

interface ServicioDetalle {
  metaDescription: string;
  heroEyebrow: string;
  heroSub: string;
  queHacemosEyebrow: string;
  queHacemosTitle: string;
  p1: string;
  p2: string;
  experienciaEyebrow: string;
  experienciaTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBtn: string;
}

export const serviciosDetalleContent: Record<'es' | 'en', Record<CategoryKey, ServicioDetalle>> = {
  es: {
    'paisajes-regenerativos': {
      metaDescription: 'Transformamos espacios verdes en oasis de vida y biodiversidad que son resilientes a climas extremos y requieren menor mantenimiento que un paisaje artificial.',
      heroEyebrow: 'Servicios · Diseño de',
      heroSub: 'Transformamos espacios verdes en oasis de vida y biodiversidad que son resilientes a climas extremos y requieren menor mantenimiento que un paisaje artificial.',
      queHacemosEyebrow: 'Qué hacemos',
      queHacemosTitle: 'Ecosistemas urbanos que cuidan solos',
      p1: 'Trabajamos con plantas nativas y soluciones basadas en la naturaleza para transformar espacios verdes degradados en ecosistemas productivos. Nuestro enfoque combina el conocimiento ecológico con el arraigo cultural de las comunidades, generando paisajes que requieren menos mantenimiento, son más resilientes al cambio climático y ofrecen más biodiversidad que un jardín convencional.',
      p2: 'Cada intervención parte de un diagnóstico del suelo, el agua y la vegetación existente, y cierra con un plan de mantenimiento que la propia comunidad puede llevar adelante.',
      experienciaEyebrow: 'Nuestra experiencia',
      experienciaTitle: 'Proyectos relacionados',
      ctaEyebrow: '¿Tienes un espacio verde que transformar?',
      ctaTitle: 'Conversemos sobre tu territorio',
      ctaBtn: 'Escríbenos →',
    },
    'espacio-publico': {
      metaDescription: 'Diseñamos espacios públicos que invitan a quedarse: lugares activos, seguros y disfrutables, con identidad propia, que la gente elige habitar y que dinamizan la vida social y económica del entorno.',
      heroEyebrow: 'Servicios · Diseño de',
      heroSub: 'Diseñamos espacios públicos que invitan a quedarse: lugares activos, seguros y disfrutables, con identidad propia, que la gente elige habitar y que dinamizan la vida social y económica del entorno.',
      queHacemosEyebrow: 'Qué hacemos',
      queHacemosTitle: 'Lugares que la gente elige habitar',
      p1: 'Cada espacio público es una oportunidad para reactivar la vida colectiva de un barrio. Diseñamos parques de bolsillo, plazoletas y espacios de encuentro que responden a las necesidades específicas del territorio, considerando seguridad, accesibilidad y calidad espacial desde el primer trazo.',
      p2: 'Nuestro trabajo va más allá del diseño: acompañamos la gestión ante entidades públicas y privadas, y exploramos formatos no convencionales cuando el contexto así lo exige.',
      experienciaEyebrow: 'Nuestra experiencia',
      experienciaTitle: 'Proyectos relacionados',
      ctaEyebrow: '¿Tienes un espacio que transformar?',
      ctaTitle: 'Conversemos sobre tu territorio',
      ctaBtn: 'Escríbenos →',
    },
    'acompanamiento-comunitario': {
      metaDescription: 'Acompañamos organizaciones e instituciones en procesos de incidencia territorial, garantizando procesos de participación ciudadana y diagnósticos territoriales sensibles, eficientes y rigurosos.',
      heroEyebrow: 'Servicios · Procesos de',
      heroSub: 'Acompañamos organizaciones e instituciones en procesos de incidencia territorial, garantizando procesos de participación ciudadana y diagnósticos territoriales sensibles, eficientes y rigurosos.',
      queHacemosEyebrow: 'Qué hacemos',
      queHacemosTitle: 'La voz de la comunidad en las decisiones del territorio',
      p1: 'Acompañamos a organizaciones e instituciones en los procesos que permiten que las comunidades incidan en las decisiones sobre su territorio. Combinamos herramientas de diagnóstico participativo, cartografía social y facilitación para garantizar procesos rigurosos y sensibles al contexto local.',
      p2: 'Nuestro equipo interdisciplinar — con formación en diseño urbano, ciencias políticas, derecho y biología — garantiza que cada proceso sea técnicamente sólido y socialmente significativo.',
      experienciaEyebrow: 'Nuestra experiencia',
      experienciaTitle: 'Proyectos relacionados',
      ctaEyebrow: '¿Necesitás acompañamiento en tu proceso?',
      ctaTitle: 'Conversemos sobre tu territorio',
      ctaBtn: 'Escríbenos →',
    },
  },
  en: {
    'paisajes-regenerativos': {
      metaDescription: 'We transform green spaces into oases of life and biodiversity that are resilient to extreme climates and require less maintenance than an artificial landscape.',
      heroEyebrow: 'Services · Design of',
      heroSub: 'We transform green spaces into oases of life and biodiversity that are resilient to extreme climates and require less maintenance than an artificial landscape.',
      queHacemosEyebrow: 'What we do',
      queHacemosTitle: 'Urban ecosystems that take care of themselves',
      p1: 'We work with native plants and nature-based solutions to transform degraded green spaces into productive ecosystems. Our approach combines ecological knowledge with the cultural roots of communities, producing landscapes that need less maintenance, are more resilient to climate change and host more biodiversity than a conventional garden.',
      p2: 'Every intervention starts with a diagnosis of the soil, water and existing vegetation, and closes with a maintenance plan the community itself can carry forward.',
      experienciaEyebrow: 'Our experience',
      experienciaTitle: 'Related projects',
      ctaEyebrow: 'Have a green space to transform?',
      ctaTitle: "Let's talk about your territory",
      ctaBtn: 'Write to us →',
    },
    'espacio-publico': {
      metaDescription: 'We design public spaces that invite people to stay: active, safe and enjoyable places with an identity of their own, which people choose to inhabit and which energize the social and economic life around them.',
      heroEyebrow: 'Services · Design of',
      heroSub: 'We design public spaces that invite people to stay: active, safe and enjoyable places with an identity of their own, which people choose to inhabit and which energize the social and economic life around them.',
      queHacemosEyebrow: 'What we do',
      queHacemosTitle: 'Places people choose to inhabit',
      p1: 'Every public space is an opportunity to reactivate the collective life of a neighborhood. We design pocket parks, plazas and gathering spaces that respond to the specific needs of the territory, considering safety, accessibility and spatial quality from the very first sketch.',
      p2: 'Our work goes beyond design: we support the management process before public and private entities, and we explore unconventional formats when the context calls for it.',
      experienciaEyebrow: 'Our experience',
      experienciaTitle: 'Related projects',
      ctaEyebrow: 'Have a space to transform?',
      ctaTitle: "Let's talk about your territory",
      ctaBtn: 'Write to us →',
    },
    'acompanamiento-comunitario': {
      metaDescription: 'We support organizations and institutions in territorial advocacy processes, guaranteeing sensitive, efficient and rigorous citizen participation and territorial diagnoses.',
      heroEyebrow: 'Services · Processes of',
      heroSub: 'We support organizations and institutions in territorial advocacy processes, guaranteeing sensitive, efficient and rigorous citizen participation and territorial diagnoses.',
      queHacemosEyebrow: 'What we do',
      queHacemosTitle: "The community's voice in territorial decisions",
      p1: 'We support organizations and institutions in the processes that allow communities to influence decisions about their territory. We combine participatory diagnosis tools, social cartography and facilitation to guarantee rigorous processes that are sensitive to the local context.',
      p2: 'Our interdisciplinary team — trained in urban design, political science, law and biology — guarantees that every process is technically sound and socially meaningful.',
      experienciaEyebrow: 'Our experience',
      experienciaTitle: 'Related projects',
      ctaEyebrow: 'Need support in your process?',
      ctaTitle: "Let's talk about your territory",
      ctaBtn: 'Write to us →',
    },
  },
};

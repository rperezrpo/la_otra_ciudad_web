// Contenido de las 3 subpáginas de servicios, por clave estable de categoría.
import type { CategoryKey } from '../categories';

/* ─── Bloques opcionales ──────────────────────────────────────────────────
 * Ninguno es obligatorio. Un servicio que no declare el campo simplemente no
 * renderiza esa sección: `ServicioDetalleBody.astro` la protege con un guard
 * por DATO (`{c.problema && …}`), nunca por servicio. Así `espacio-publico` y
 * `acompanamiento-comunitario` salen hoy byte por byte igual que antes, y el
 * día que quieran un bloque solo hay que rellenar el objeto.
 *
 * OJO bilingüe: como los campos son opcionales, TypeScript NO exige que el
 * bloque exista en los dos idiomas. Si añades uno en `es`, añádelo también en
 * `en` o la página inglesa queda silenciosamente más corta.
 *
 * Los `href` van SIN prefijo de idioma: el componente aplica `localizePath`.
 */

interface LinkOut {
  label: string;
  href: string;
}

/** BLOQUE "problema": párrafos + tabla comparativa de dos columnas. */
interface ComparisonBlock {
  eyebrow?: string;
  title: string;
  body: string[];
  colALabel: string;
  colBLabel: string;
  /** Pares [columna A, columna B]. Tupla a propósito: dos arrays paralelos se
   *  desincronizan en longitud y una fila huérfana rompe la comparación. */
  rows: [string, string][];
}

interface OfferItem {
  title: string;
  desc: string;
}

/** BLOQUE "oferta": rejilla de entregables + cierre "para quién". */
interface OfferBlock {
  eyebrow?: string;
  title: string;
  intro?: string;
  items: OfferItem[];
  closingTitle?: string;
  closing?: string;
}

interface PrincipleItem {
  title: string;
  desc: string;
}

interface PrinciplesBlock {
  eyebrow?: string;
  title: string;
  items: PrincipleItem[];
  link?: LinkOut;
}

interface StatItem {
  num: string;
  label: string;
}

/** BLOQUE "disciplinas": párrafo de experticia + chips inertes. */
interface DisciplinesBlock {
  eyebrow?: string;
  title: string;
  body?: string;
  items: string[];
  link?: LinkOut;
}

/** BLOQUE "manifiesto": cita a sangre. Sin `image` cae al gradiente de la
 *  página, que es un fondo deliberado, no un hueco. */
interface QuoteBlock {
  eyebrow?: string;
  text: string;
  image?: string;
}

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

  /* Opcionales — hoy solo los usa paisajes-regenerativos. */
  heroBtn?: LinkOut;
  problema?: ComparisonBlock;
  oferta?: OfferBlock;
  principios?: PrinciplesBlock;
  cifras?: StatItem[];
  disciplinas?: DisciplinesBlock;
  manifiesto?: QuoteBlock;
  ctaText?: string;
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
      ctaTitle: 'Un jardín que regenera',
      ctaBtn: 'Escríbenos →',

      heroBtn: { label: 'Cuéntanos sobre tu espacio', href: '/contacto' },

      problema: {
        eyebrow: 'Por qué',
        title: 'El desierto verde',
        body: [
          'Un jardín tradicional puede verse lleno de vida y ser un desierto verde para la fauna nativa. Necesita riego constante, fumigación y reemplazos frecuentes, y es vulnerable a las sequías e inundaciones que ya hacen parte de nuestro clima. Colombia está dentro del 20% de los países más expuestos al cambio climático, y los jardines que sembramos hoy tienen que estar preparados para ese futuro.',
          'La paradoja es que la solución crece al lado. Antioquia tiene un área similar a la de Letonia y alberga 13.858 especies de plantas vasculares, más que toda Europa junta. Casi ninguna vive en nuestros jardines.',
        ],
        colALabel: 'Jardín tradicional',
        colBLabel: 'Jardín regenerativo',
        rows: [
          ['Requiere riego manual', 'Retiene y filtra el agua'],
          ['Vulnerable a sequías', 'Resiliente a sequías'],
          ['Requiere fumigación', 'Menos vulnerable a plagas'],
          ['Necesita reemplazos constantes', 'Bajo mantenimiento'],
        ],
      },

      oferta: {
        eyebrow: 'Nuestros servicios',
        title: 'Lo que podemos diseñar y sembrar contigo',
        intro: 'Trabajamos a distintas escalas y en espacios muy distintos, con paisajes que son ornamentales y funcionales al mismo tiempo.',
        items: [
          { title: 'Diseño paisajístico naturalista', desc: 'Concepto, planta de siembra y paleta vegetal por capas.' },
          { title: 'Siembra de especies nativas',     desc: 'Selección, suministro e instalación de material vegetal.' },
          { title: 'Jardines de polinizadores',       desc: 'Floraciones que atraen abejas, mariposas y aves.' },
          { title: 'Infraestructura verde y agua lluvia', desc: 'Jardines de lluvia, drenajes vivos y suelos permeables.' },
          { title: 'Muros y techos verdes',           desc: 'Jardinería vertical y cubiertas vegetadas.' },
          { title: 'Mantenimiento regenerativo',      desc: 'Acompañamiento para que el jardín madure con el tiempo.' },
        ],
        closingTitle: 'Para hogares e instituciones',
        closing: 'Trabajamos en todas las escalas del paisaje. Diseñamos y sembramos jardines para casas, conjuntos residenciales, empresas y fincas, y también desarrollamos proyectos de paisajismo regenerativo con constructoras, centros comerciales, universidades, municipios y organizaciones que quieren que sus espacios verdes presten servicios reales a las personas y al ecosistema. Si tienes un espacio, tenemos una propuesta a su medida.',
      },

      principios: {
        eyebrow: 'Cómo lo hacemos',
        title: 'Cuatro principios guían cada paisaje que diseñamos',
        items: [
          { title: 'Composición ecológica', desc: 'Composiciones basadas en ecosistemas locales: capas, texturas y floración a lo largo del año.' },
          { title: 'Especies nativas',      desc: 'Siembra mayoritariamente nativa, con especies seleccionadas por los servicios que prestan al ecosistema.' },
          { title: 'Suelo y agua',          desc: 'Infraestructura verde que trabaja con el agua y construye territorios esponja.' },
          { title: 'Paisajes con propósito', desc: 'Jardines funcionales, comunitarios, alimenticios y educativos. Jardines para habitar.' },
        ],
        link: { label: 'Conoce nuestro método paso a paso →', href: '/metodologia' },
      },

      // CIFRAS PENDIENTES DE CONFIRMACIÓN — ver informe. Derivadas de:
      // 1.250 m² = Barrios Vivos 650 (San Rafael + Alto Las Flores) + Ecos de la Matea 600.
      // 641 plantas = 45 (San Rafael) + 146 (Alto Las Flores) + 450 (Ecos de la Matea).
      // 70+ especies = Ecos de la Matea sola ya aporta 70; San Rafael (11) y
      //                Alto Las Flores (34) suman más, con solapamiento desconocido.
      cifras: [
        { num: '1.250 m²', label: 'de paisaje regenerado' },
        { num: '641',      label: 'plantas nativas sembradas' },
        { num: '70+',      label: 'especies nativas' },
      ],

      disciplinas: {
        eyebrow: 'Nuestra experticia',
        title: 'Todos los campos del paisajismo, en un mismo equipo',
        body: 'Somos la primera corporación en Colombia liderada por jóvenes dedicada al urbanismo y a la regeneración del paisaje. Nuestra experticia cruza el diseño urbano y de paisaje, la ecología y la biodiversidad, la construcción sostenible y la resiliencia climática, y la gestión y el derecho urbano. Esa mezcla nos permite acompañar un jardín desde el diagnóstico del suelo hasta el diseño, la siembra y su cuidado en el tiempo, y asumir cada proyecto como una oportunidad para aprender y fortalecer nuestras capacidades.',
        items: ['Diseño de paisaje', 'Ecología y biodiversidad', 'Construcción sostenible', 'Gestión y derecho urbano'],
        link: { label: 'Conoce al equipo →', href: '/quienes-somos' },
      },

      manifiesto: {
        eyebrow: 'Manifiesto',
        text: 'Creemos en el jardín nativo como una herramienta para desdibujar la distinción entre lo humano y lo natural, y transformar nuestra manera de habitar.',
        // image: '/images/paisajes/manifiesto.jpg'  ← al subir la foto, descomentar.
      },

      ctaText: 'Cuéntanos sobre tu espacio y diseñamos una propuesta a la medida. El silencio de un jardín no es permanente: con las especies correctas, vuelve a sonar.',
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
      queHacemosTitle: 'Urban ecosystems that look after themselves',
      p1: 'We work with native plants and nature-based solutions to transform degraded green spaces into productive ecosystems. Our approach combines ecological knowledge with the cultural roots of communities, producing landscapes that need less maintenance, are more resilient to climate change and host more biodiversity than a conventional garden.',
      p2: 'Every intervention starts with a diagnosis of the soil, water and existing vegetation, and closes with a maintenance plan the community itself can carry forward.',
      experienciaEyebrow: 'Our experience',
      experienciaTitle: 'Related projects',
      ctaEyebrow: 'Have a green space to transform?',
      ctaTitle: 'A garden that regenerates',
      ctaBtn: 'Write to us →',

      heroBtn: { label: 'Tell us about your space', href: '/contacto' },

      problema: {
        eyebrow: 'Why',
        title: 'The green desert',
        body: [
          'A conventional garden can look full of life and still be a green desert for native wildlife. It needs constant watering, spraying and frequent replacements, and it is vulnerable to the droughts and floods that are already part of our climate. Colombia sits within the 20% of countries most exposed to climate change, and the gardens we plant today have to be ready for that future.',
          "The paradox is that the solution grows next door. Antioquia covers an area similar to Latvia's and holds 13,858 species of vascular plants, more than the whole of Europe combined. Almost none of them live in our gardens.",
        ],
        colALabel: 'Conventional garden',
        colBLabel: 'Regenerative garden',
        rows: [
          ['Needs manual watering', 'Retains and filters water'],
          ['Vulnerable to drought', 'Resilient to drought'],
          ['Needs spraying', 'Less prone to pests'],
          ['Constant replacements', 'Low maintenance'],
        ],
      },

      oferta: {
        eyebrow: 'Our services',
        title: 'What we can design and plant with you',
        intro: 'We work at different scales and in very different spaces, on landscapes that are ornamental and functional at the same time.',
        items: [
          { title: 'Naturalistic landscape design', desc: 'Concept, planting plan and a layered plant palette.' },
          { title: 'Native species planting',       desc: 'Selection, supply and installation of plant material.' },
          { title: 'Pollinator gardens',            desc: 'Flowering cycles that draw in bees, butterflies and birds.' },
          { title: 'Green infrastructure and rainwater', desc: 'Rain gardens, living drainage and permeable soils.' },
          { title: 'Green walls and roofs',         desc: 'Vertical gardening and vegetated roofs.' },
          { title: 'Regenerative maintenance',      desc: 'Support so the garden matures over time.' },
        ],
        closingTitle: 'For homes and institutions',
        closing: 'We work at every scale of the landscape. We design and plant gardens for houses, residential complexes, companies and farms, and we also develop regenerative landscaping projects with developers, shopping centres, universities, municipalities and organisations that want their green spaces to provide real services to people and to the ecosystem. If you have a space, we have a proposal that fits it.',
      },

      principios: {
        eyebrow: 'How we do it',
        title: 'Four principles guide every landscape we design',
        items: [
          { title: 'Ecological composition', desc: 'Compositions drawn from local ecosystems: layers, textures and flowering through the year.' },
          { title: 'Native species',         desc: 'Mostly native planting, with species chosen for the services they provide to the ecosystem.' },
          { title: 'Soil and water',         desc: 'Green infrastructure that works with water and builds sponge territories.' },
          { title: 'Landscapes with a purpose', desc: 'Functional, communal, edible and educational gardens. Gardens to live with.' },
        ],
        link: { label: 'See our method step by step →', href: '/metodologia' },
      },

      // Mismas cifras que en `es` — ver el comentario de derivación allí.
      cifras: [
        { num: '1,250 m²', label: 'of landscape regenerated' },
        { num: '641',      label: 'native plants planted' },
        { num: '70+',      label: 'native species' },
      ],

      disciplinas: {
        eyebrow: 'Our expertise',
        title: 'Every field of landscape practice, in one team',
        body: 'We are the first youth-led corporation in Colombia dedicated to urbanism and landscape regeneration. Our expertise spans urban and landscape design, ecology and biodiversity, sustainable construction and climate resilience, and urban management and law. That mix lets us support a garden from the soil diagnosis through to design, planting and its care over time, and to take on each project as a chance to learn and strengthen our capabilities.',
        items: ['Landscape design', 'Ecology and biodiversity', 'Sustainable construction', 'Urban management and law'],
        link: { label: 'Meet the team →', href: '/quienes-somos' },
      },

      manifiesto: {
        eyebrow: 'Manifesto',
        text: 'We believe the native garden is a tool for blurring the distinction between the human and the natural, and for changing the way we inhabit the world.',
        // image: '/images/paisajes/manifiesto.jpg'  ← al subir la foto, descomentar.
      },

      ctaText: "Tell us about your space and we will design a proposal that fits it. A garden's silence is not permanent: with the right species, it starts to sound again.",
    },
    'espacio-publico': {
      metaDescription: 'We design public spaces that invite people to stay: active, safe and enjoyable places with an identity of their own, which people choose to inhabit and which energise the social and economic life around them.',
      heroEyebrow: 'Services · Design of',
      heroSub: 'We design public spaces that invite people to stay: active, safe and enjoyable places with an identity of their own, which people choose to inhabit and which energise the social and economic life around them.',
      queHacemosEyebrow: 'What we do',
      queHacemosTitle: 'Places people choose to inhabit',
      p1: 'Every public space is an opportunity to reactivate the collective life of a neighbourhood. We design pocket parks, plazas and gathering spaces that respond to the specific needs of the territory, considering safety, accessibility and spatial quality from the very first sketch.',
      p2: 'Our work goes beyond design: we support the management process before public and private entities, and we explore unconventional formats when the context calls for it.',
      experienciaEyebrow: 'Our experience',
      experienciaTitle: 'Related projects',
      ctaEyebrow: 'Have a space to transform?',
      ctaTitle: "Let's talk about your territory",
      ctaBtn: 'Write to us →',
    },
    'acompanamiento-comunitario': {
      metaDescription: 'We support organisations and institutions in territorial advocacy processes, guaranteeing sensitive, efficient and rigorous citizen participation and territorial diagnoses.',
      heroEyebrow: 'Services · Processes of',
      heroSub: 'We support organisations and institutions in territorial advocacy processes, guaranteeing sensitive, efficient and rigorous citizen participation and territorial diagnoses.',
      queHacemosEyebrow: 'What we do',
      queHacemosTitle: "The community's voice in territorial decisions",
      p1: 'We support organisations and institutions in the processes that allow communities to influence decisions about their territory. We combine participatory diagnosis tools, social cartography and facilitation to guarantee rigorous processes that are sensitive to the local context.',
      p2: 'Our interdisciplinary team, trained in urban design, political science, law and biology, guarantees that every process is technically sound and socially meaningful.',
      experienciaEyebrow: 'Our experience',
      experienciaTitle: 'Related projects',
      ctaEyebrow: 'Need support in your process?',
      ctaTitle: "Let's talk about your territory",
      ctaBtn: 'Write to us →',
    },
  },
};

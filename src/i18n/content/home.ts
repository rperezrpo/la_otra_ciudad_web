export const homeContent = {
  es: {
    metaTitle: 'Inicio',
    metaDescription: 'Corporación La Otra Ciudad — co-creamos ciudades más biodiversas, justas y saludables junto a comunidades de Medellín, Colombia.',
    jsonLdDescription: 'Corporación sin ánimo de lucro que co-crea ciudades más justas, sostenibles y saludables en Medellín, Colombia.',

    heroTitle: 'Construimos ciudades más biodiversas, justas y saludables',
    heroScrollAria: 'Desplazarse hacia abajo',

    misionEyebrow: 'Quiénes somos',
    misionTitle: 'Diseñamos con y para quienes más lo necesitan',
    misionBody: 'Somos una corporación sin ánimo de lucro fundada en Medellín en 2021. Trabajamos mediante soluciones basadas en la naturaleza, diseño participativo de espacio público, intervenciones artísticas y fortalecimiento del tejido social, siempre junto a las comunidades.',
    misionBtnQuienes: 'Conoce más',
    misionImgAlt: 'Comunidad San Rafael',

    // Agregados de toda la organización. Deben ser SIEMPRE ≥ que la suma de los
    // proyectos que la propia web enumera; si se añade un proyecto con cifras,
    // hay que recalcularlos aquí, en proyectos.ts y en la tira de paisajes
    // (servicios-detalle.ts → 'paisajes-regenerativos'.cifras).
    //   1.265 m² = 650 Barrios Vivos (San Rafael + Alto Las Flores)
    //            + 600 Ecos de la Matea + 15 AulaViva
    //   641 plantas = 45 San Rafael + 146 Alto Las Flores + 450 Ecos de la Matea
    //   21 talleres: sin cambio — 8 Barrios Vivos + 4 AulaViva + Llanaditas,
    //                Ecos y Parque El Bosque (estos tres sin cifra publicada).
    stats: [
      ['1.265+', 'm² de espacio público transformado'],
      ['641',    'Plantas nativas sembradas'],
      ['21',     'Talleres con comunidades'],
      ['2',      'Premios internacionales'],
    ] as [string, string][],

    metodEyebrow: 'Metodología',
    metodTitle: 'Un proceso centrado en la comunidad',
    metodP1: 'En La Otra Ciudad creemos que transformar una ciudad empieza por mirarla como lo que es: un ecosistema vivo, donde las personas, los barrios y la naturaleza forman parte de un mismo tejido. Desde ahí trabajamos, no para imponer soluciones, sino para regenerar ese tejido junto a quienes lo habitan.',
    metodP2: 'Los cuatro valores que guían nuestro diseño no son ideas sueltas, sino las piezas de una misma forma de entender la ciudad. Haz click en el diagrama y descubre más sobre ellos.',

    featuredTitle: 'Transformaciones recientes',
    featuredVerTodos: 'Todos los proyectos',
    donarTitle: 'Mejoremos juntos nuestra ciudad',
    donarText: 'Cada aporte, por pequeño que sea, llega directamente a nuestros programas comunitarios.',
  },
  en: {
    metaTitle: 'Home',
    metaDescription: 'Corporación La Otra Ciudad: we co-create more biodiverse, fair and healthy cities together with communities in Medellín, Colombia.',
    jsonLdDescription: 'Non-profit organisation co-creating fairer, more sustainable and healthier cities in Medellín, Colombia.',

    heroTitle: 'We build more biodiverse, fair and healthy cities',
    heroScrollAria: 'Scroll down',

    misionEyebrow: 'About us',
    misionTitle: 'We design with and for those who need it most',
    misionBody: 'We are a non-profit organisation founded in Medellín in 2021. We work through nature-based solutions, participatory public-space design, artistic interventions and the strengthening of the social fabric, always alongside communities.',
    misionBtnQuienes: 'Learn more',
    misionImgAlt: 'San Rafael community',

    stats: [
      ['1,265+', 'm² of public space transformed'],
      ['641',    'Native plants planted'],
      ['21',     'Workshops with communities'],
      ['2',      'International awards'],
    ] as [string, string][],

    metodEyebrow: 'Methodology',
    metodTitle: 'A community-centred process',
    metodP1: 'At La Otra Ciudad we believe that transforming a city starts with seeing it for what it is: a living ecosystem where people, neighbourhoods and nature are part of the same fabric. That is where we work from, not to impose solutions but to regenerate that fabric together with the people who inhabit it.',
    metodP2: 'The four values that guide our design are not loose ideas but pieces of a single way of understanding the city. Click on the diagram to discover more about them.',

    featuredTitle: 'Recent transformations',
    featuredVerTodos: 'All projects',
    donarTitle: 'Join us in building better cities',
    donarText: 'Every contribution, however small, goes directly to our community programmes.',
  },
} as const;

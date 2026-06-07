import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.PUBLIC_SANITY_DATASET || 'production',
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const doc = {
  _id:  'project-cocreacion-explora',
  _type: 'project',

  title:  'Co-creación Explora',
  slug:   { _type: 'slug', current: 'cocreacion-explora' },
  category: 'Hábitat',
  year:   2025,
  status: 'activo',
  featured: false,

  neighborhood: 'Moravia — Comuna 4, Medellín',

  partners: [
    'Parque Explora',
    'Secretaría de Cultura Ciudadana de Medellín',
    'Buen Comienzo',
    'Medellín Conversa',
  ],

  // Texto corto para las tarjetas
  summary:
    'Diagnóstico participativo y diseño colaborativo del espacio verde junto a la Biblioteca Buen Comienzo del Parque Explora, en el barrio Moravia.',

  // Descripción completa (Portable Text)
  description: [
    {
      _type: 'block',
      _key:  'p1',
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span', _key: 's1', marks: [],
        text: 'El Parque Explora tiene bajo comodato un espacio verde junto a la futura Biblioteca Buen Comienzo, en el barrio Moravia de Medellín. La zona, históricamente subutilizada, alberga una pequeña huerta comunitaria y colinda con un polígono de espacio público habilitado recientemente pero sin dotación. El barrio y sus aledaños —Aranjuez, Sevilla, Miranda— presentan una escasez severa de espacio público de calidad.',
      }],
    },
    {
      _type: 'block',
      _key:  'p2',
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span', _key: 's2', marks: [],
        text: 'El proyecto busca resignificar ese paisaje urbano junto a la comunidad, transformándolo en un ecosistema activo con huertas expandidas, espacio de juego para niños y una red ecológica que dialogue con la futura biblioteca infantil. El diseño parte de cuatro valores acordados con los actores del proyecto: participación y apropiación, accesibilidad universal, convivencia y seguridad, y regeneración ecológica.',
      }],
    },
    {
      _type: 'block',
      _key:  'p3',
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span', _key: 's3', marks: [],
        text: 'La Otra Ciudad aportó al proceso desde dos frentes: el diseño técnico del espacio y la coordinación del proceso participativo. La metodología contempla tres momentos: diagnóstico comunitario con múltiples públicos —niños, madres gestantes, vendedores ambulantes, adultos mayores, líderes y ciudadanos del común—, un filtro interno de diseño, y una retroalimentación comunitaria antes de la construcción, garantizando que la comunidad sea coautora del resultado.',
      }],
    },
    {
      _type: 'block',
      _key:  'p4',
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span', _key: 's4', marks: [],
        text: 'El proyecto se desarrolla en alianza con el Parque Explora, la Secretaría de Cultura Ciudadana de Medellín, el programa Buen Comienzo y la organización Medellín Conversa, que aportó instrumentos de conversación ciudadana para humanizar el proceso de diagnóstico territorial.',
      }],
    },
  ],
}

const result = await client.createIfNotExists(doc)
console.log('✓ Proyecto creado / ya existía:', result._id)

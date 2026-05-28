// Imports real project data extracted from the Wix CMS CSV export.
// Downloads hero images from Wix CDN and uploads them to Sanity.
// Deletes the 3 demo projects and creates the 6 real ones.
//
// Run with:  npm run import:projects
import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing env. Need PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

// ─── Image download from Wix CDN ───────────────────────────────────────────

const imageCache = new Map()

async function uploadWixImage(wixHash) {
  if (!wixHash) return undefined
  if (imageCache.has(wixHash)) return imageCache.get(wixHash)

  const url = `https://static.wixstatic.com/media/${wixHash}`
  console.log(`  ↓ ${wixHash}`)
  let buffer
  try {
    const res = await fetch(url)
    if (!res.ok) { console.warn(`    ⚠ HTTP ${res.status}, skipping`); return undefined }
    buffer = Buffer.from(await res.arrayBuffer())
  } catch (e) {
    console.warn(`    ⚠ Download failed: ${e.message}, skipping`)
    return undefined
  }

  const ext  = wixHash.endsWith('.jpeg') ? 'jpeg' : 'jpg'
  const asset = await client.assets.upload('image', buffer, { filename: `${wixHash}.${ext}` })
  const ref   = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  imageCache.set(wixHash, ref)
  return ref
}

// ─── Project data (extracted from Proyectos.csv) ──────────────────────────

const PROJECTS = [
  {
    _id: 'project-llanaditas',
    title: 'Llanaditas',
    slug: 'llanaditas',
    category: 'Educación',
    year: 2023,
    status: 'completado',
    neighborhood: 'Medellín, Colombia',
    featured: false,
    partners: [],
    summary: '¿Cómo ve, siente y habitan las personas sus barrios? ¿Qué piensan cuando piensan en él? ¿Cómo lograr un mejor entendimiento de las vivencias del otro? Este proyecto se enfocó en darle respuesta a estas preguntas.',
    description:
`El proyecto Llanaditas fue la primera actividad de nuestra corporación.

Consistió en un taller de dos sesiones realizado con niños de entre 5 y 14 años del barrio Llanaditas en la comuna 8 del municipio de Medellín.

Con este taller queríamos que estos niños reconocieran y se apropiaran más del territorio que habitan, logrando crear vínculos más fuertes y duraderos que les permitan habitar y transformar el espacio según sus necesidades.

Sirviéndonos de historias, cosas, memorias y vivencias en común les pedimos que dibujaran el barrio como ellos se lo imaginaban, según su forma de ver y vivir el mundo. Luego, creamos una ilustración que reuniera todos estos elementos que ellos habían plasmado en el papel y diseñamos y estampamos camisetas con estos imaginarios que nos habían contado.

Gracias a una "vaca virtual" conseguimos patrocinadoras que nos permitieron hacer posible estas camisetas que les llevamos como cierre del proyecto, en un taller que mezcló retroalimentación, baile, juegos y una celebración comunitaria.`,
    heroImageHash: '43d542_2f56913716154e9183890e31ecf715c7~mv2.jpg',
  },
  {
    _id: 'project-san-rafael',
    title: 'San Rafael',
    slug: 'san-rafael',
    category: 'Hábitat',
    year: 2023,
    status: 'completado',
    neighborhood: 'Envigado, Colombia',
    featured: true,
    partners: ['S2Cities'],
    summary: '¿Cómo intervenir más de 300 m² de espacio público, zonas verdes, cemento sin vida y convertirlo en un verdadero espacio comunitario? Este proyecto fue una gran prueba que sentó las bases de nuestra corporación.',
    description:
`Una nueva etapa empieza para La Otra Ciudad de la mano de una gran oportunidad: el programa Barrios Vivos.

En el 2022 La Otra Ciudad fue elegida como la ganadora del programa S2Cities y recibió un incentivo económico de $2.850.000 COP para implementar un proyecto de transformación del espacio público. Para llevarlo a cabo elegimos, después de varios análisis y trabajo de campo, al Barrio San Rafael en Envigado, cuyas características representaban un gran desafío para el aprovechamiento efectivo del territorio.

La intervención de este espacio, que venía siendo utilizado solo como un corredor de paso, empezó con la realización de un gran mural donado por un artista local, que representaba el espíritu que los vecinos del barrio se soñaban para su hogar, con naturaleza, aves, color y vida.

Se crearon jardines funcionales y se sembraron 45 nuevas plantas, flores y arbustos de 11 especies nativas, entre las cuales se encontraban distintas plantas que atrajeran mariposas y aves polinizadoras. Además, se instaló un área de compostaje y un "hotel de abejas".

Uno de los grandes problemas que se identificó en la zona era la falta de áreas de juego y esparcimiento para los niños del sector. Por esto, convertimos una loza de cemento que funcionaba como parqueadero informal de motos en un nuevo parque infantil en el que los niños pudieran hacer actividad física, desarrollar su motricidad y hasta aprender de música sin tener que ir lejos de sus casas.

El diseño final de la intervención, que se desarrolló en dos fases durante seis fines de semana, se logró luego de varios talleres con la comunidad, en la que a través de actividades, juegos e integraciones, los habitantes del sector pudieron contarnos sus problemáticas, necesidades, las soluciones que proponían para estas y cómo se imaginaban su barrio.

Así, juntos, grandes y chicos, logramos llevar del papel a la realidad el proyecto y materializar este sueño, interviniendo más de 150 m² de espacio público para beneficio de los habitantes del barrio San Rafael.`,
    heroImageHash: '5cca3a_db82565fa2d140d2b6270f7779946a5e~mv2.jpg',
  },
  {
    _id: 'project-alto-las-flores',
    title: 'Alto Las Flores',
    slug: 'alto-las-flores',
    category: 'Hábitat',
    year: 2024,
    status: 'completado',
    neighborhood: 'Envigado, Colombia',
    featured: true,
    partners: ['S2Cities', 'Junta de Acción Comunal'],
    summary: 'El proyecto Barrios Vivos continúa. Un antes y después que nos permitiría fortalecer las bases de nuestra corporación.',
    description:
`Tras la exitosa experiencia del barrio San Rafael, La Otra Ciudad es elegida nuevamente como ganadora de un apoyo económico de $24.000.000 para implementar dos nuevos proyectos de intervención urbanística.

Este camino nos llevaría a la Loma del Barro, en el sector Alto de las Flores de Envigado. Acá nos enfrentábamos a características similares a las de San Rafael: poco espacio verde, un colegio y un espacio público subutilizado y ocupado por carros o motos. En fin, un lugar con un gran potencial, pero que no estaba pudiendo ser disfrutado por la comunidad del sector.

La metodología fue la misma: empezamos con encuestas a los habitantes del barrio, para conocer cómo era su percepción en temas como seguridad, juventud, espacios de esparcimiento o trabajo comunitario. Después iniciamos una serie de talleres en los que la comunidad tuvo la posibilidad de contarnos su contexto, la vida de su barrio, sus necesidades y sus propuestas para hacerlo mejor para todos.

Con una comunidad ilusionada y muy animada llegamos por fin al momento de ponernos manos a la obra. Volvimos a encontrarnos con viejos amigos y aliados del proyecto de San Rafael, como nuestros muralistas @wes.oner y @seeker.uno, quienes nuevamente pusieron su arte al servicio de la comunidad, con un gran mural alusivo a la naturaleza y la comunidad.

El siguiente paso fue un trabajo centrado en la movilidad del sector, donde se pintó la calle con colores vistosos para crear espacios peatonales más visibles y seguros, algo muy necesario tomando en cuenta que justo allí se encuentra la salida del colegio de la zona.

Finalmente llegó la hora de la naturaleza. Con la ayuda de muchas personas del sector, especialmente de niños, se sembraron un total de 146 plantas de hasta 34 especies diferentes que atrajeran aves, abejas y mariposas. Además, se instaló nuevo mobiliario urbano que fomentara el encuentro ciudadano.

En total, se intervinieron y transformaron más de 340 m² de espacio público para uso y disfrute de la comunidad del Alto de las Flores.`,
    heroImageHash: '43d542_ceb6be37a68344098f585c73f895df96~mv2.jpg',
  },
  {
    _id: 'project-ecos-de-la-matea',
    title: 'Ecos de la Matea',
    slug: 'ecos-de-la-matea',
    category: 'Cultura',
    year: 2026,
    status: 'activo',
    neighborhood: 'Medellín, Colombia',
    featured: true,
    partners: [],
    summary: '',
    description: '',
    heroImageHash: 'a20a6d_b4f533f5f4ba4f2f85c4a4ea8444501e~mv2.jpg',
  },
  {
    _id: 'project-aulaviva',
    title: 'AulaViva',
    slug: 'aulaviva',
    category: 'Educación',
    year: 2025,
    status: 'activo',
    neighborhood: 'Medellín, Colombia',
    featured: false,
    partners: [],
    summary: '',
    description: '',
    heroImageHash: 'a20a6d_6b9b37e210934b8dabd547896e001d6e~mv2.jpeg',
  },
  {
    _id: 'project-redhonda',
    title: 'RedHonda',
    slug: 'redhonda',
    category: 'Hábitat',
    year: 2026,
    status: 'activo',
    neighborhood: 'Medellín, Colombia',
    featured: false,
    partners: [],
    summary: '',
    description: '',
    heroImageHash: 'a20a6d_9af9bc36d8024b19827db1868ccceec8~mv2.jpg',
  },
]

// ─── Run ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Target: project ${projectId}, dataset "${dataset}"\n`)

  // Delete the 3 demo placeholder projects
  const demoIds = [
    'project-barrios-en-movimiento',
    'project-escuelas-de-ciudadania',
    'project-memorias-del-territorio',
  ]
  console.log('Deleting demo projects…')
  for (const id of demoIds) {
    try { await client.delete(id); console.log(`  ✓ deleted ${id}`) }
    catch { console.log(`  – ${id} not found, skipping`) }
  }

  // Import real projects
  console.log(`\nImporting ${PROJECTS.length} projects…`)
  for (const p of PROJECTS) {
    console.log(`\n→ ${p.title}`)
    const heroImage = await uploadWixImage(p.heroImageHash)
    const doc = {
      _id:          p._id,
      _type:        'project',
      title:        p.title,
      slug:         { _type: 'slug', current: p.slug },
      category:     p.category,
      year:         p.year,
      status:       p.status,
      neighborhood: p.neighborhood,
      partners:     p.partners,
      featured:     p.featured,
      ...(p.summary     ? { summary:     p.summary }     : {}),
      ...(p.description ? { description: p.description } : {}),
      ...(heroImage     ? { heroImage }                   : {}),
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ saved`)
  }

  console.log('\nDone. ✅')
}

main().catch((e) => { console.error(e); process.exit(1) })

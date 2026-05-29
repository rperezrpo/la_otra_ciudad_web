// Patches summaries, descriptions, partners and neighborhoods for the three
// projects that lacked content in the initial import.
// Source: Informe de Gestión 2025 + Portafolio Institucional.
//
// Run with:  npm run patch:descriptions
import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing env. Need PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const patches = [
  {
    _id: 'project-ecos-de-la-matea',
    neighborhood: 'Laureles, Medellín, Colombia',
    partners: ['UMI Fund', 'Social Change Nest'],
    summary: 'Recuperación socioambiental de la quebrada La Matea con enfoque de biodiversidad urbana, acción climática comunitaria y soluciones basadas en la naturaleza.',
    description:
`Ecos de la Matea es un proyecto de recuperación socioambiental urbana ubicado en el barrio La Castellana, Laureles (comuna 11 de Medellín).

Su eje central es la quebrada La Matea, que atraviesa el barrio y había perdido conexión con la comunidad. El proyecto parte de la premisa de que "recuperar la calle es recuperar la quebrada": si el espacio público que bordea la quebrada se transforma en un lugar vivo y apropiado por la comunidad, la quebrada también se cuida.

El proceso combina soluciones basadas en la naturaleza, intervención de espacio público, biodiversificación urbana y formación comunitaria en acción climática. Se realizaron talleres participativos para co-diseñar la intervención con los habitantes del barrio.

Resultados: 600 m² de espacio público intervenido, 450 plantas de 70 especies nativas sembradas, 18 personas externas vinculadas al proceso y 2 nuevas alianzas institucionales. El proyecto sigue en ejecución.

Aliados: UMI Fund, Social Change Nest. Presupuesto: $28.399.361 COP.`,
  },
  {
    _id: 'project-aulaviva',
    neighborhood: 'La Candelaria, Medellín, Colombia',
    partners: ['Everyday Homeless', 'Fundación Mi Sangre'],
    summary: 'Readecuación participativa de una habitación en un inquilinato para convertirla en biblioteca comunitaria y refugio pedagógico para la niñez del barrio Estación Villa.',
    description:
`AulaViva es un proyecto de espacio público comunitario ubicado en el barrio Estación Villa, La Candelaria (comuna 10 de Medellín).

El punto de partida fue una habitación en un inquilinato, un tipo de vivienda que concentra familias en condición de vulnerabilidad en el centro de la ciudad. Con el apoyo de Everyday Homeless y Fundación Mi Sangre, La Otra Ciudad co-diseñó con la población infantil del sector la transformación de ese espacio en una biblioteca comunitaria y refugio pedagógico.

El proceso se desarrolló en cuatro talleres de co-creación en los que los niños y niñas fueron los protagonistas: ellos definieron los usos, los colores, los materiales y los objetos que querían tener en su nuevo espacio.

Resultados: 15 m² readecuados, 4 talleres de co-creación realizados, 30 participantes directos. Presupuesto: $3.647.686 COP (recursos propios + Fundación Mi Sangre).`,
  },
  {
    _id: 'project-redhonda',
    neighborhood: 'Manrique, Medellín, Colombia',
    partners: ['Proyecto NN', 'Somos x Naturaleza'],
    summary: 'Primera consultoría de La Otra Ciudad: co-producción de una línea base sobre expansión urbana, cobertura del suelo y riesgos socioambientales en el barrio La Honda, Manrique.',
    description:
`RedHonda es la primera consultoría formal de La Otra Ciudad, desarrollada en el barrio La Honda, Manrique (comuna 3 de Medellín).

La Honda es un asentamiento autoconstruido en la ladera nororiental de Medellín, con aproximadamente 16.000 habitantes. La zona presenta dinámicas complejas de expansión urbana informal, riesgos socioambientales y déficit de servicios.

En alianza con Somos x Naturaleza y Proyecto NN, La Otra Ciudad co-produjo una línea base integral del territorio que incluye: análisis de expansión urbana y cobertura del suelo, diagnóstico de riesgos ecológicos, de infraestructura, vivienda y movilidad, y una geodatabase cartográfica del sector.

El trabajo derivó en un conjunto de recomendaciones para el mejoramiento integral del barrio, orientadas a actores comunitarios, institucionales y académicos.

Presupuesto: $3.000.000 COP. Primera experiencia de LOC en investigación aplicada y consultoría territorial.`,
  },
]

async function main() {
  console.log(`Target: project ${projectId}, dataset "${dataset}"\n`)
  for (const p of patches) {
    console.log(`→ Patching ${p._id}`)
    await client
      .patch(p._id)
      .set({
        neighborhood: p.neighborhood,
        partners:     p.partners,
        summary:      p.summary,
        description:  p.description,
      })
      .commit()
    console.log(`  ✓ done`)
  }
  console.log('\nDone. ✅')
}

main().catch((e) => { console.error(e); process.exit(1) })

// Loads the English translations of the 7 existing projects into Sanity
// (title.en, summary.en, description.en). The Spanish source of truth is
// untouched; descriptions are authored here in markdown and converted with
// the same markdownToPortableText used by the edit form, so the result is
// editable from /proyectos/editar like any other content.
//
// Idempotent: by default a field is only written when its `en` value is empty,
// so manual edits made later in the form are never overwritten. Use --force to
// overwrite non-empty fields too.
//
// Run with:
//   npm run translate:projects-en -- --dry-run
//   npm run translate:projects-en
import { createClient } from '@sanity/client'
import { markdownToPortableText } from '../src/lib/portableText.ts'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_WRITE_TOKEN
const dryRun    = process.argv.includes('--dry-run')
const force     = process.argv.includes('--force')

if (!projectId || !token) {
  console.error('Missing env. Need PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const TRANSLATIONS = {
  'alto-las-flores': {
    title: 'Alto Las Flores',
    summary:
      'A 340 m² public-space intervention in the Alto de las Flores neighbourhood, built with the community. Regenerative gardens, mural art and safe mobility in front of a school.',
    description: `After the successful experience in the San Rafael neighbourhood, La Otra Ciudad was once again selected to receive financial support of $24,000,000 COP to implement two new urban intervention projects.

This path led us to Loma del Barro, in the Alto de las Flores sector of Envigado. Here we faced conditions similar to those of San Rafael: little green space, a school, and an underused public space occupied by cars and motorbikes. In short, a place with great potential that the local community was not able to enjoy.

The methodology was the same: we began with surveys of the neighbourhood's residents to understand their perceptions around topics such as safety, youth, recreational spaces and community work. We then ran a series of workshops in which the community could tell us about their context, the life of their neighbourhood, their needs and their proposals to make it better for everyone.

With an excited and highly motivated community, the time finally came to get to work. We reunited with old friends and allies from the San Rafael project, such as our muralists @wes.oner and @seeker.uno, who once again put their art at the service of the community with a large mural evoking nature and community.

The next step focused on mobility in the area: the street was painted in bright colours to create more visible and safer pedestrian spaces, much needed given that the local school's exit is right there.

Finally it was nature's turn. With the help of many local residents, especially children, a total of 146 plants of up to 34 different species were planted to attract birds, bees and butterflies. New street furniture was also installed to encourage community gathering.

In total, more than 340 m² of public space were transformed for the use and enjoyment of the Alto de las Flores community.`,
  },

  'aulaviva': {
    title: 'AulaViva',
    summary:
      'Participatory refurbishment of a room in a tenement building, turning it into a community library and pedagogical refuge for the children of the Estación Villa neighbourhood.',
    description: `AulaViva is a community public-space project located in the Estación Villa neighbourhood, La Candelaria (Medellín's comuna 10).

The starting point was a room in a tenement building (inquilinato), a type of housing that concentrates families in vulnerable conditions in the city centre. With the support of Everyday Homeless and Fundación Mi Sangre, La Otra Ciudad co-designed with the neighbourhood's children the transformation of that space into a community library and pedagogical refuge.

The process unfolded across four co-creation workshops in which the children were the protagonists: they defined the uses, the colours, the materials and the objects they wanted in their new space.

Results: 15 m² refurbished, 4 co-creation workshops held, 30 direct participants. Budget: $3,647,686 COP (own resources + Fundación Mi Sangre).`,
  },

  'ecos-de-la-matea': {
    title: 'Ecos de la Matea',
    summary:
      'Socio-environmental recovery of the La Matea creek with a focus on urban biodiversity, community climate action and nature-based solutions.',
    description: `Ecos de la Matea is an urban socio-environmental recovery project located in the La Castellana neighbourhood, Laureles (Medellín's comuna 11).

Its centrepiece is the La Matea creek, which runs through the neighbourhood and had lost its connection with the community. The project starts from the premise that "recovering the street means recovering the creek": if the public space along the creek becomes a living place the community takes ownership of, the creek is cared for too.

The process combines nature-based solutions, public-space intervention, urban biodiversification and community training in climate action. Participatory workshops were held to co-design the intervention with the neighbourhood's residents.

Results: 600 m² of public space transformed, 450 plants of 70 native species planted, 18 external participants involved in the process and 2 new institutional alliances. The project is still underway.

Partners: UMI Fund, Social Change Nest. Budget: $28,399,361 COP.`,
  },

  'llanaditas': {
    title: 'Llanaditas',
    summary:
      'How do people see, feel and inhabit their neighbourhoods? What do they think of when they think about them? How can we better understand each other’s experiences? This project set out to answer these questions.',
    description: `The Llanaditas project was our corporation's first activity.

It consisted of a two-session workshop with children between 5 and 14 years old from the Llanaditas neighbourhood in comuna 8 of Medellín.

With this workshop we wanted these children to recognise and take greater ownership of the territory they inhabit, building stronger and longer-lasting bonds that allow them to inhabit and transform the space according to their needs.

Drawing on shared stories, objects, memories and experiences, we asked them to draw the neighbourhood as they imagined it, according to their way of seeing and living the world. We then created an illustration bringing together everything they had put on paper, and designed and printed t-shirts with the imaginaries they had shared with us.

Thanks to a virtual crowdfunding drive we found sponsors who made these t-shirts possible. We brought them as the project's closing gift, in a final workshop that mixed feedback, dance, games and a community celebration.`,
  },

  'parque-el-bosque': {
    title: 'El Bosque Station',
    summary:
      'Participatory diagnosis and collaborative design of the green space next to Parque Explora’s Buen Comienzo Library, in the Moravia neighbourhood.',
    description: `Parque Explora holds a green space under a loan-for-use agreement next to the future Buen Comienzo Library, in Medellín's Moravia neighbourhood. The area, historically underused, hosts a small community garden and borders a recently enabled but unequipped stretch of public space. The neighbourhood and its surroundings (Aranjuez, Sevilla, Miranda) suffer a severe shortage of quality public space.

The project seeks to give new meaning to that urban landscape together with the community, transforming it into an active ecosystem with expanded gardens, a play area for children and an ecological network in dialogue with the future children's library. The design is grounded in four values agreed with the project's stakeholders: participation and ownership, universal accessibility, coexistence and safety, and ecological regeneration.

La Otra Ciudad contributed on two fronts: the technical design of the space and the coordination of the participatory process. The methodology involves three stages: a community diagnosis with multiple audiences (children, expectant mothers, street vendors, older adults, community leaders and everyday citizens), an internal design filter, and a community feedback round before construction, guaranteeing that the community co-authors the result.

The project is developed in alliance with Parque Explora, Medellín's Secretariat of Citizen Culture, the Buen Comienzo programme and the organisation Medellín Conversa, which contributed citizen-conversation instruments to humanise the territorial diagnosis process.`,
  },

  'redhonda': {
    title: 'RedHonda',
    summary:
      'La Otra Ciudad’s first consultancy: co-production of a baseline on urban expansion, land cover and socio-environmental risks in the La Honda neighbourhood, Manrique.',
    description: `RedHonda is La Otra Ciudad's first formal consultancy, carried out in the La Honda neighbourhood, Manrique (Medellín's comuna 3).

La Honda is a self-built settlement on Medellín's north-eastern hillside, home to roughly 16,000 people. The area faces complex dynamics of informal urban expansion, socio-environmental risks and a deficit of services.

In alliance with Somos x Naturaleza and Proyecto NN, La Otra Ciudad co-produced a comprehensive baseline of the territory including: analysis of urban expansion and land cover, a diagnosis of ecological, infrastructure, housing and mobility risks, and a cartographic geodatabase of the sector.

The work resulted in a set of recommendations for the comprehensive improvement of the neighbourhood, aimed at community, institutional and academic actors.

Budget: $3,000,000 COP. LOC's first experience in applied research and territorial consultancy.`,
  },

  'san-rafael': {
    title: 'San Rafael',
    summary:
      'How do you transform more than 300 m² of public space (green areas and lifeless concrete) into a true community space? This project was a great test that laid the foundations of our corporation.',
    description: `A new stage began for La Otra Ciudad with a great opportunity: the Barrios Vivos programme.

In 2022 La Otra Ciudad was selected as the winner of the S2Cities programme and received a financial incentive of $2,850,000 COP to implement a public-space transformation project. After several analyses and fieldwork, we chose the San Rafael neighbourhood in Envigado, whose characteristics posed a great challenge for making effective use of the territory.

The intervention of this space, which had been used only as a passing corridor, began with a large mural donated by a local artist, representing the spirit the neighbourhood's residents dreamed of for their home: nature, birds, colour and life.

Functional gardens were created and 45 new plants, flowers and shrubs of 11 native species were planted, including several plants meant to attract butterflies and pollinating birds. A composting area and a "bee hotel" were also installed.

One of the biggest problems identified in the area was the lack of play and recreation areas for local children. So we turned a concrete slab that served as an informal motorbike parking area into a new playground where children can be physically active, develop their motor skills and even learn music without having to go far from home.

The final design of the intervention, carried out in two phases over six weekends, was reached after several workshops with the community in which, through activities, games and gatherings, local residents could tell us about their problems, their needs, the solutions they proposed and how they imagined their neighbourhood.

And so, together, young and old, we took the project from paper to reality and made this dream come true, transforming more than 150 m² of public space for the benefit of the residents of the San Rafael neighbourhood.`,
  },
}

const isEmptyEn = (v) =>
  v == null || v === '' || (Array.isArray(v) && v.length === 0)

async function main() {
  console.log(`Target: project ${projectId}, dataset "${dataset}"${dryRun ? '  [DRY RUN — no writes]' : ''}${force ? '  [FORCE — overwrite non-empty en]' : ''}\n`)

  const projects = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ _id, "slug": slug.current, title, summary, description }`
  )

  let patched = 0
  for (const p of projects) {
    const tr = TRANSLATIONS[p.slug]
    if (!tr) {
      console.log(`  ! ${p.slug}: sin traducción definida — se salta`)
      continue
    }
    if (typeof p.title === 'string' || Array.isArray(p.description)) {
      console.log(`  ! ${p.slug}: aún sin migrar a {es,en} — corre primero migrate:project-i18n`)
      continue
    }

    const set = {}
    if (force || isEmptyEn(p.title?.en)) set['title.en'] = tr.title
    if (force || isEmptyEn(p.summary?.en)) set['summary.en'] = tr.summary
    if (force || isEmptyEn(p.description?.en)) set['description.en'] = markdownToPortableText(tr.description)

    if (Object.keys(set).length === 0) {
      console.log(`  – ${p.slug}: en ya tiene contenido, sin cambios`)
      continue
    }

    const fields = Object.keys(set).join(', ')
    if (dryRun) {
      const blocks = set['description.en'] ? `${set['description.en'].length} bloques` : '—'
      console.log(`  ○ ${p.slug}: se escribiría [${fields}] (description.en: ${blocks})`)
    } else {
      await client.patch(p._id).set(set).commit()
      console.log(`  ✓ ${p.slug}: traducido [${fields}]`)
    }
    patched++
  }

  console.log(`\n${dryRun ? 'Dry run listo' : 'Listo'}. ${patched} proyecto(s) ${dryRun ? 'por traducir' : 'traducido(s)'}. ${dryRun ? '' : '✅'}`)
}

main().catch((e) => { console.error(e); process.exit(1) })

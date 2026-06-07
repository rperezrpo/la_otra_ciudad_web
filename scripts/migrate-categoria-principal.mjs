import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.PUBLIC_SANITY_DATASET || 'production',
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Fetch all projects that still have the old `category` string field
// but don't yet have `categoria_principal`
const projects = await client.fetch(
  `*[_type == "project" && defined(category) && string(category) == category]{
    _id, title, category, categoria_principal
  }`
)

if (projects.length === 0) {
  console.log('Nada que migrar — todos los proyectos ya tienen categoria_principal.')
  process.exit(0)
}

console.log(`Migrando ${projects.length} proyecto(s)…`)

for (const p of projects) {
  await client
    .patch(p._id)
    .setIfMissing({ categoria_principal: p.category })
    .commit()
  console.log(`  ✓ ${p.title}  →  categoria_principal: "${p.category}"`)
}

console.log('Migración completa.')

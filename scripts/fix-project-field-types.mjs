// One-time migration to fix Studio "Value is of type string, expected array"
// errors on `project` documents. The original Wix import (and the later
// patch-descriptions script) stored two fields as plain strings while the
// schema declares them as arrays:
//
//   • category    → array of strings   (now emptied to []; selected manually in Studio)
//   • description → array of blocks     (legacy string converted to Portable Text)
//
// categoria_principal is intentionally left untouched.
// Idempotent: only documents whose stored value is still a string are patched.
//
// Run with:  npm run fix:project-types
import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing env. Need PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

/** Plain string → Portable Text blocks (one block per paragraph). */
function stringToPortableText(val, id) {
  return val.split(/\n\n+/).map((s) => s.trim()).filter(Boolean).map((text, i) => ({
    _type: 'block',
    _key: `mig-${id}-${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `mig-${id}-${i}-0`, text, marks: [] }],
  }))
}

async function main() {
  console.log(`Target: project ${projectId}, dataset "${dataset}"\n`)

  // Fetch every project, flagging which fields are still stored as strings.
  // string(x) == x is true only when x is already a string.
  const projects = await client.fetch(
    `*[_type == "project"]{
      _id, title, description,
      "categoryIsString": defined(category) && string(category) == category,
      "descriptionIsString": defined(description) && string(description) == description
    }`
  )

  let patched = 0
  for (const p of projects) {
    const set = {}
    if (p.categoryIsString) set.category = []
    if (p.descriptionIsString) set.description = stringToPortableText(p.description, p._id)

    if (Object.keys(set).length === 0) {
      console.log(`  – ${p.title}: ya correcto, sin cambios`)
      continue
    }

    await client.patch(p._id).set(set).commit()
    const fixed = Object.keys(set).join(', ')
    console.log(`  ✓ ${p.title}: corregido [${fixed}]`)
    patched++
  }

  console.log(`\nListo. ${patched} proyecto(s) corregido(s). ✅`)
}

main().catch((e) => { console.error(e); process.exit(1) })

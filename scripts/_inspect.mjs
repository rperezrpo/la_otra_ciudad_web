import { createClient } from '@sanity/client'
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN, apiVersion: '2024-01-01', useCdn: false,
})

// 1. All document types + counts (incl. drafts)
const types = await client.fetch(`*[!(_id in path("_.**"))]{ _type } | { "t": _type }`)
const counts = {}
for (const d of types) counts[d._type] = (counts[d._type] || 0) + 1
console.log('Document types in dataset:')
console.log(JSON.stringify(counts, null, 2))

// 2. For projects, check fields the schema declares as arrays.
//    Report any doc where the field is defined but NOT an array.
const arrayFields = ['category', 'description', 'partners', 'gallery']
const projects = await client.fetch(`*[_type == "project"]`)
console.log(`\nScanning ${projects.length} project docs for array fields stored as non-array:`)
let found = false
for (const p of projects) {
  for (const f of arrayFields) {
    const v = p[f]
    if (v !== undefined && v !== null && !Array.isArray(v)) {
      console.log(`  ✗ ${p._id}.${f} = (${typeof v}) ${JSON.stringify(v)}`)
      found = true
    }
  }
}
if (!found) console.log('  (none — all array fields are arrays)')

// 3. List the raw _type of every doc id to spot orphan/legacy types
console.log('\nAll doc ids by type:')
const all = await client.fetch(`*[!(_id in path("_.**"))]{ _id, _type } | order(_type asc)`)
for (const d of all) console.log(`  [${d._type}] ${d._id}`)

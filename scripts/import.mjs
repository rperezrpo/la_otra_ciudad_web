// One-off migration: reads src/data/*.json and creates Sanity documents.
// Local images referenced in the JSON are uploaded as Sanity image assets.
//
// Run with:  npm run import
// Requires .env with PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN
import { createClient } from '@sanity/client'
import { createReadStream, existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing env. Need PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Cache uploads so the same file isn't uploaded twice.
const assetCache = new Map()

async function uploadImage(publicPath) {
  if (!publicPath) return undefined
  if (assetCache.has(publicPath)) return assetCache.get(publicPath)

  // JSON paths look like "/images/people/ricardo.jpg" → public/images/people/ricardo.jpg
  const filePath = path.join(root, 'public', publicPath.replace(/^\//, ''))
  if (!existsSync(filePath)) {
    console.warn(`  ⚠ image not found, skipping: ${publicPath}`)
    return undefined
  }

  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  assetCache.set(publicPath, ref)
  return ref
}

async function readJson(rel) {
  return JSON.parse(await readFile(path.join(root, rel), 'utf8'))
}

async function importPeople() {
  const people = await readJson('src/data/people.json')
  console.log(`\nImporting ${people.length} people…`)
  for (const [i, p] of people.entries()) {
    const photo = await uploadImage(p.photo)
    const doc = {
      _id: `person-${p.slug}`,
      _type: 'person',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      role: p.role || undefined,
      bio: p.bio || undefined,
      linkedin: p.linkedin || undefined,
      state: p.state === 'inactive' ? 'inactive' : 'active',
      order: i,
      ...(photo ? { photo } : {}),
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${p.name}`)
  }
}

async function importProjects() {
  const projects = await readJson('src/data/projects.json')
  console.log(`\nImporting ${projects.length} projects…`)
  for (const [i, p] of projects.entries()) {
    const heroImage = await uploadImage(p.heroImage)
    const gallery = []
    for (const g of p.gallery || []) {
      const ref = await uploadImage(g)
      if (ref) gallery.push({ ...ref, _key: `g${gallery.length}` })
    }
    const doc = {
      _id: `project-${p.slug}`,
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: p.category,
      summary: p.summary || undefined,
      description: p.description || undefined,
      neighborhood: p.neighborhood || undefined,
      partners: p.partners || [],
      year: p.year,
      status: p.status === 'completado' ? 'completado' : 'activo',
      featured: i < 3, // seed the first three as featured for the home page
      ...(heroImage ? { heroImage } : {}),
      ...(gallery.length ? { gallery } : {}),
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${p.title}`)
  }
}

async function main() {
  console.log(`Importing into project ${projectId}, dataset "${dataset}"`)
  await importPeople()
  await importProjects()
  console.log('\nDone. ✅')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

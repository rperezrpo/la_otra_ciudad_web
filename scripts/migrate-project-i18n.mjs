// One-time migration for the bilingual (ES/EN) project schema:
//
//   • title       string            → { es: title, en: '' }
//   • summary     string            → { es: summary, en: '' }
//   • description array of blocks   → { es: blocks, en: [] }
//   • categoria_principal / category[]  Spanish label → stable key
//       'Paisajes Regenerativos'     → 'paisajes-regenerativos'
//       'Espacio Público'            → 'espacio-publico'
//       'Acompañamiento Comunitario' → 'acompanamiento-comunitario'
//
// Idempotent: fields already in the target shape are skipped, so it's safe to
// re-run (e.g. for documents saved by the new edit form before the migration).
//
// Run with:
//   npm run migrate:project-i18n -- --dry-run   (print patches, write nothing)
//   npm run migrate:project-i18n                (apply against the live dataset)
import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_WRITE_TOKEN
const dryRun    = process.argv.includes('--dry-run')

if (!projectId || !token) {
  console.error('Missing env. Need PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const LEGACY_CATEGORY_TO_KEY = {
  'Paisajes Regenerativos':      'paisajes-regenerativos',
  'Espacio Público':             'espacio-publico',
  'Acompañamiento Comunitario':  'acompanamiento-comunitario',
}
const CATEGORY_KEYS = new Set(Object.values(LEGACY_CATEGORY_TO_KEY))

const isLocalized = (v) => v != null && typeof v === 'object' && !Array.isArray(v)

function categoryToKey(value) {
  if (CATEGORY_KEYS.has(value)) return value // already migrated
  return LEGACY_CATEGORY_TO_KEY[value] ?? null
}

async function main() {
  console.log(`Target: project ${projectId}, dataset "${dataset}"${dryRun ? '  [DRY RUN — no writes]' : ''}\n`)

  const projects = await client.fetch(
    `*[_type == "project"]{ _id, title, summary, description, categoria_principal, category }`
  )

  let patched = 0
  let warnings = 0
  for (const p of projects) {
    const set = {}
    const name = isLocalized(p.title) ? p.title.es : p.title

    if (p.title != null && !isLocalized(p.title)) set.title = { es: p.title, en: '' }
    if (p.summary != null && !isLocalized(p.summary)) set.summary = { es: p.summary, en: '' }
    if (p.description != null && !isLocalized(p.description)) set.description = { es: p.description, en: [] }

    if (p.categoria_principal != null && !CATEGORY_KEYS.has(p.categoria_principal)) {
      const key = categoryToKey(p.categoria_principal)
      if (key) {
        set.categoria_principal = key
      } else {
        console.warn(`  ! ${name}: categoria_principal desconocida "${p.categoria_principal}" — sin cambio`)
        warnings++
      }
    }

    if (Array.isArray(p.category) && p.category.some((c) => !CATEGORY_KEYS.has(c))) {
      const mapped = p.category.map((c) => categoryToKey(c)).filter(Boolean)
      if (mapped.length === p.category.length) {
        set.category = mapped
      } else {
        console.warn(`  ! ${name}: category contiene valores desconocidos ${JSON.stringify(p.category)} — sin cambio`)
        warnings++
      }
    }

    if (Object.keys(set).length === 0) {
      console.log(`  – ${name}: ya migrado, sin cambios`)
      continue
    }

    console.log(`  ${dryRun ? '○' : '✓'} ${name}: ${dryRun ? 'se migraría' : 'migrado'} [${Object.keys(set).join(', ')}]`)
    if (dryRun) {
      for (const [k, v] of Object.entries(set)) {
        const preview = JSON.stringify(v)
        console.log(`      ${k} → ${preview.length > 140 ? preview.slice(0, 140) + '…' : preview}`)
      }
    } else {
      await client.patch(p._id).set(set).commit()
    }
    patched++
  }

  console.log(`\n${dryRun ? 'Dry run listo' : 'Listo'}. ${patched} proyecto(s) ${dryRun ? 'por migrar' : 'migrado(s)'}${warnings ? `, ${warnings} advertencia(s)` : ''}. ${dryRun ? '' : '✅'}`)
}

main().catch((e) => { console.error(e); process.exit(1) })

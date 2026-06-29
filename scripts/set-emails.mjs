// Sets the Google Workspace email on each person document, so they can log in
// at /equipo/editar and edit their own profile.
//
// HOW TO USE:
//   1. Fill in the EMAILS map below (key = slug, value = @laotraciudad.org email).
//      Leave a value as '' to skip that person for now.
//   2. Run:  npm run set:emails
//
// Re-runnable: it only updates the people you filled in, and is safe to run
// again after adding more.
import { createClient } from '@sanity/client'

const ALLOWED_DOMAIN = 'laotraciudad.org'

// slug  →  email   (names shown for reference; '' = skip)
const EMAILS = {
  // ── Equipo activo ────────────────────────────────────────────────
  'ricardo-perez':         'ricardo@laotraciudad.org', // Ricardo Pérez
  'sebastian-balthazar':   '', // Sebastián Balthazar
  'eloisa-henriquez':      '', // Eloísa Henríquez
  'felipe-carmona':        '', // Felipe Carmona
  'jose-alejandro-guerra': '', // José Alejandro Guerra
  'samuel-pelaez':         '', // Samuel Peláez
  'mateo-ramirez':         '', // Mateo Ramírez
  'natalia-hernandez':     '', // Natalia Hernández
  'laura-patino':          '', // Laura Patiño
  'miguel-angel-ocampo':   '', // Miguel Angel Ocampo
  'jose-baena':            '', // José Baena
  'tomas-hernandez':       '', // Tomás Hernández
  'manuela-vasquez':       '', // Manuela Vásquez

  // ── Inactivos (descomenta si alguno necesita acceso) ─────────────
  // 'santiago-jaramillo':        '', // Santiago Jaramillo
  // 'juana-valentina-carmona':   '', // Juana Valentina Carmona
  // 'carolina-londono':          '', // Carolina Londoño
  // 'tatiana-pantoja':           '', // Tatiana Pantoja
  // 'laura-betancourt':          '', // Laura Betancourt
  // 'daniela-morelo':            '', // Daniela Morelo
  // 'daniel-alvarez':            '', // Daniel Álvarez
  // 'isabela-arbelaez':          '', // Isabela Arbeláez
  // 'sebastian-de-jesus-campo':  '', // Sebastián de Jesús Campo
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing env. Need PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

async function main() {
  const entries = Object.entries(EMAILS).filter(([, email]) => email.trim())
  if (!entries.length) {
    console.log('Nothing to do — fill in some emails in the EMAILS map first.')
    return
  }

  console.log(`Setting ${entries.length} email(s)…\n`)
  let ok = 0
  for (const [slug, rawEmail] of entries) {
    const email = rawEmail.trim().toLowerCase()
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      console.warn(`  ⚠ ${slug}: "${email}" is not @${ALLOWED_DOMAIN} — skipped`)
      continue
    }
    const id = await client.fetch(`*[_type=="person" && slug.current==$slug][0]._id`, { slug })
    if (!id) {
      console.warn(`  ⚠ ${slug}: no person found with that slug — skipped`)
      continue
    }
    await client.patch(id).set({ email }).commit()
    console.log(`  ✓ ${slug} → ${email}`)
    ok++
  }
  console.log(`\nDone. ${ok} updated. ✅`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

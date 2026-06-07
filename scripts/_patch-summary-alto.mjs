import { createClient } from '@sanity/client'

const token = process.env.SANITY_WRITE_TOKEN
const me = await fetch('https://nkzuaihq.api.sanity.io/v2021-06-07/users/me', {
  headers: { Authorization: `Bearer ${token}` },
}).then(r => r.json())
console.log('Token role:', me.roles?.map(r => r.name).join(', ') || me.role)

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.PUBLIC_SANITY_DATASET || 'production',
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

await client
  .patch('project-alto-las-flores')
  .set({ summary: 'Intervención de 340 m² de espacio público en el barrio Alto de las Flores, junto a la comunidad. Talleres participativos, arte mural, movilidad segura frente al colegio y siembra de 146 plantas de 34 especies para atraer aves, abejas y mariposas.' })
  .commit()

console.log('✓ Summary actualizado correctamente.')

// getStaticPaths compartido por /equipo/[slug] y /en/equipo/[slug].
// (El i18n nativo de Astro no duplica rutas: cada idioma tiene su archivo
// bajo src/pages, y ambos delegan aquí.)
import { getPersonSlugs, getPerson, type PersonDetailData } from './sanity'
import type { Lang } from '../i18n/ui'

export async function personStaticPaths(locale: Lang) {
  const slugs = await getPersonSlugs()
  const people = await Promise.all(slugs.map((slug) => getPerson(slug, locale)))
  return people
    .filter((person): person is PersonDetailData => person !== null)
    .map((person) => ({
      params: { slug: person.slug },
      props: { person },
    }))
}

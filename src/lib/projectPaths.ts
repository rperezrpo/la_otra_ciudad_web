// getStaticPaths compartido por /proyectos/[slug] y /en/proyectos/[slug].
// (El i18n nativo de Astro no duplica rutas: cada idioma tiene su archivo
// bajo src/pages, y ambos delegan aquí.)
import { getProjectSlugs, getProject, type ProjectDetailData } from './sanity'
import type { Lang } from '../i18n/ui'

export async function projectStaticPaths(locale: Lang) {
  const slugs = await getProjectSlugs()
  const projects = await Promise.all(slugs.map((slug) => getProject(slug, locale)))
  return projects
    .filter((project): project is ProjectDetailData => project !== null)
    .map((project) => ({
      params: { slug: project.slug },
      props: { project },
    }))
}

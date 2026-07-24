import { sanityClient } from 'sanity:client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { portableTextToMarkdown } from './portableText'
import type { Lang } from '../i18n/ui'
import { CATEGORY_META, categoryKey, categoryLabel } from '../i18n/categories'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** Resolve a Sanity image to a URL string, or '' so components fall back to placeholders. */
function img(source: SanityImageSource | undefined, width: number): string {
  if (!source || !(source as any).asset) return ''
  return urlFor(source).width(width).auto('format').fit('max').url()
}

// ─── i18n helpers ────────────────────────────────────────────────────────────
// Fields migrated to {es, en} objects, with tolerance for the legacy plain
// value so deploy order doesn't matter (code first, data migration after).

type LocaleField = { es?: string; en?: string } | string | undefined | null

/** {es,en} → localized string with Spanish fallback; legacy plain string passes through. */
export function pickLocale(field: LocaleField, locale: Lang): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[locale] || field.es || ''
}

/** Same for Portable Text: {es: blocks, en: blocks} or legacy blocks/string. */
function pickLocaleBlocks(field: any, locale: Lang): any {
  if (!field) return field
  if (Array.isArray(field) || typeof field === 'string') return field // legacy shape
  const localized = field[locale]
  return (Array.isArray(localized) && localized.length > 0) ? localized : field.es
}

/** Same for plain string arrays: {es: string[], en: string[]}, with legacy array pass-through. */
function pickLocaleStringArray(field: any, locale: Lang): string[] {
  if (!field) return []
  if (Array.isArray(field)) return field // legacy shape
  const localized = field[locale]
  return (Array.isArray(localized) && localized.length > 0) ? localized : (field.es ?? [])
}

/** Values to match in GROQ for a category: the stable key plus the legacy Spanish label. */
function categoryQueryValues(key: string): string[] {
  const k = categoryKey(key)
  return k ? [k, CATEGORY_META[k].es] : [key]
}

// ─── Projects ──────────────────────────────────────────────────────────────

const PROJECT_CARD_FIELDS = `
  title,
  "slug": slug.current,
  "category": categoria_principal,
  "categories": category[],
  summary,
  heroImage,
  status,
  year,
  featured
`

export interface ProjectCardData {
  title: string
  slug: string
  /** Stable category key (see CATEGORY_META). */
  category: string
  /** Localized label for display. */
  categoryLabel: string
  /** Stable keys of all categories (used by the client-side filter). */
  categories: string[]
  summary: string
  heroImage: string
  status: string
  year: number
}

function toCard(p: any, locale: Lang): ProjectCardData {
  const key = categoryKey(p.category)
  return {
    title: pickLocale(p.title, locale),
    slug: p.slug,
    category: key,
    categoryLabel: categoryLabel(p.category, locale),
    categories: (p.categories ?? []).map((c: string) => categoryKey(c)).filter(Boolean),
    summary: pickLocale(p.summary, locale),
    heroImage: img(p.heroImage, 800),
    status: p.status,
    year: p.year,
  }
}

export async function getProjectsBySlug(slugs: string[], locale: Lang = 'es'): Promise<ProjectCardData[]> {
  const data = await sanityClient.fetch(
    `*[_type == "project" && slug.current in $slugs]{${PROJECT_CARD_FIELDS}}`,
    { slugs }
  )
  // Preserve the order defined in slugs
  const map = new Map(data.map((p: any) => [p.slug, toCard(p, locale)]))
  return slugs.map(s => map.get(s)).filter(Boolean) as ProjectCardData[]
}

export async function getProjectsByCategory(category: string, locale: Lang = 'es'): Promise<ProjectCardData[]> {
  const data = await sanityClient.fetch(
    `*[_type == "project" && categoria_principal in $values] | order(year desc, title.es asc, title asc){${PROJECT_CARD_FIELDS}}`,
    { values: categoryQueryValues(category) }
  )
  return data.map((p: any) => toCard(p, locale))
}

export async function getProjects(locale: Lang = 'es'): Promise<ProjectCardData[]> {
  const data = await sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)] | order(year desc, title.es asc, title asc){${PROJECT_CARD_FIELDS}}`
  )
  return data.map((p: any) => toCard(p, locale))
}

export async function getFeaturedProjects(limit = 3, locale: Lang = 'es'): Promise<ProjectCardData[]> {
  const featured = await sanityClient.fetch(
    `*[_type == "project" && featured == true && defined(slug.current)] | order(year desc, title.es asc, title asc)[0...$limit]{${PROJECT_CARD_FIELDS}}`,
    { limit }
  )
  if (featured.length > 0) return featured.map((p: any) => toCard(p, locale))
  // Fall back to the most recent projects if none are explicitly featured.
  const recent = await sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)] | order(year desc, title.es asc, title asc)[0...$limit]{${PROJECT_CARD_FIELDS}}`,
    { limit }
  )
  return recent.map((p: any) => toCard(p, locale))
}

export interface ProjectDetailData {
  title: string
  slug: string
  /** Stable category key (see CATEGORY_META). */
  category: string
  /** Localized label for display. */
  categoryLabel: string
  summary: string
  heroImage: string
  description: any[]   // Portable Text blocks
  neighborhood: string
  partners: string[]
  year: number
  status: string
  gallery: string[]
}

/** Handles both legacy plain-text descriptions and new Portable Text arrays. */
function normalizeDescription(val: any): any[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  // Legacy: plain string → wrap as a single Portable Text paragraph
  if (typeof val === 'string') {
    return val.split(/\n\n+/).filter(Boolean).map((text, i) => ({
      _type: 'block',
      _key: `legacy-${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
    }))
  }
  return []
}

export async function getProjectSlugs(): Promise<string[]> {
  return sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)].slug.current`
  )
}

export async function getProject(slug: string, locale: Lang = 'es'): Promise<ProjectDetailData | null> {
  const p = await sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      "category": categoria_principal,
      summary,
      heroImage,
      description,
      neighborhood,
      partners,
      year,
      status,
      gallery
    }`,
    { slug }
  )
  if (!p) return null
  return {
    title: pickLocale(p.title, locale),
    slug: p.slug,
    category: categoryKey(p.category),
    categoryLabel: categoryLabel(p.category, locale),
    summary: pickLocale(p.summary, locale),
    heroImage: img(p.heroImage, 1600),
    description: normalizeDescription(pickLocaleBlocks(p.description, locale)),
    neighborhood: p.neighborhood ?? '',
    partners: p.partners ?? [],
    year: p.year,
    status: p.status,
    gallery: (p.gallery ?? []).map((g: SanityImageSource) => img(g, 1000)).filter(Boolean),
  }
}

// ─── Project editing (self-service form) ─────────────────────────────────────
// The edit form shows BOTH languages, so these functions do not resolve a
// locale: they expose {es, en} pairs (normalizing legacy plain values to es).

export interface ProjectListItem {
  slug: string
  title: string
  heroImage: string
  status: string
  year: number
}

export async function getEditableProjects(): Promise<ProjectListItem[]> {
  const data = await sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)] | order(year desc, title.es asc, title asc){
      title, "slug": slug.current, heroImage, status, year
    }`
  )
  return data.map((p: any) => ({
    slug: p.slug,
    title: pickLocale(p.title, 'es') || '(sin título)',
    heroImage: img(p.heroImage, 240),
    status: p.status ?? '',
    year: p.year,
  }))
}

export interface ProjectEditData {
  slug: string
  title: { es: string; en: string }
  categoria_principal: string
  category: string[]
  summary: { es: string; en: string }
  descriptionMarkdown: { es: string; en: string }
  neighborhood: string
  partners: string[]
  year: number | null
  status: string
  featured: boolean
  heroImage: string
  gallery: { key: string; url: string }[]
}

function localePair(field: LocaleField): { es: string; en: string } {
  if (!field) return { es: '', en: '' }
  if (typeof field === 'string') return { es: field, en: '' }
  return { es: field.es ?? '', en: field.en ?? '' }
}

function descriptionToMarkdown(desc: any): string {
  if (Array.isArray(desc)) return portableTextToMarkdown(desc)
  if (typeof desc === 'string') return desc
  return ''
}

export async function getProjectForEdit(slug: string): Promise<ProjectEditData | null> {
  const p = await sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      title, "slug": slug.current, categoria_principal, category, summary,
      description, neighborhood, partners, year, status, featured, heroImage, gallery
    }`,
    { slug }
  )
  if (!p) return null
  const desc = p.description
  const isLocalizedDesc = desc && !Array.isArray(desc) && typeof desc === 'object'
  return {
    slug: p.slug,
    title: localePair(p.title),
    categoria_principal: categoryKey(p.categoria_principal),
    category: (p.category ?? []).map((c: string) => categoryKey(c)).filter(Boolean),
    summary: localePair(p.summary),
    descriptionMarkdown: {
      es: descriptionToMarkdown(isLocalizedDesc ? desc.es : desc),
      en: descriptionToMarkdown(isLocalizedDesc ? desc.en : undefined),
    },
    neighborhood: p.neighborhood ?? '',
    partners: p.partners ?? [],
    year: p.year ?? null,
    status: p.status ?? 'activo',
    featured: !!p.featured,
    heroImage: img(p.heroImage, 600),
    gallery: (p.gallery ?? [])
      .filter((g: any) => g?.asset)
      .map((g: any) => ({ key: g._key, url: img(g, 400) })),
  }
}

// ─── People ────────────────────────────────────────────────────────────────

/** A person's link, e.g. from the "Enlaces" list. `type` is a stable preset
 * key ('linkedin', 'orcid') with a fixed display label, or 'custom' for a
 * freeform `label`. */
export interface PersonLink {
  type: string
  label: string
  url: string
}

const LINK_TYPE_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  orcid: 'ORCID',
}

/** Resolves the "links" array, tolerating documents still using the legacy
 * standalone `linkedin` field (merged in as a 'linkedin'-type link unless
 * one is already present in `links`). */
function resolvePersonLinks(rawLinks: any[] | undefined, legacyLinkedin?: string): PersonLink[] {
  const links: PersonLink[] = (rawLinks ?? [])
    .map((l: any) => ({
      type: l?.type ?? 'custom',
      label: LINK_TYPE_LABELS[l?.type] ?? (l?.label ?? ''),
      url: l?.url ?? '',
    }))
    .filter((l) => l.url)
  if (legacyLinkedin && !links.some((l) => l.type === 'linkedin')) {
    links.unshift({ type: 'linkedin', label: 'LinkedIn', url: legacyLinkedin })
  }
  return links
}

export interface PersonData {
  name: string
  slug: string
  role: string
  bio: string
  photo: string
  links: PersonLink[]
  state: string
}

export interface EditablePersonLink {
  type: string
  label: string
  url: string
}

/** Raw (unresolved) version of resolvePersonLinks — the edit form needs the
 * actual stored label, not the display label ORCID/LinkedIn get on the
 * public site. */
function editableLinks(rawLinks: any[] | undefined, legacyLinkedin?: string): EditablePersonLink[] {
  const links: EditablePersonLink[] = (rawLinks ?? [])
    .map((l: any) => ({ type: l?.type ?? 'custom', label: l?.label ?? '', url: l?.url ?? '' }))
    .filter((l) => l.url)
  if (legacyLinkedin && !links.some((l) => l.type === 'linkedin')) {
    links.unshift({ type: 'linkedin', label: '', url: legacyLinkedin })
  }
  return links
}

/** A person's editable profile, matched by their Google Workspace email.
 * Localized fields expose both languages (like getProjectForEdit), since
 * the edit form shows es/en side by side rather than resolving one. */
export interface EditablePerson {
  _id: string
  name: string
  role: string
  bio: string
  photo: string // resolved URL for previewing the current photo
  links: EditablePersonLink[]
  longBioMarkdown: { es: string; en: string }
  researchAreas: { es: string[]; en: string[] }
  cv: string // resolved URL for previewing the current CV
  relatedProjectSlugs: string[]
}

export async function getPersonByEmail(email: string): Promise<EditablePerson | null> {
  const p = await sanityClient.fetch(
    `*[_type == "person" && lower(email) == lower($email)][0]{
      _id, name, role, bio, linkedin, links, photo, longBio, researchAreas,
      "cv": cv.asset->url,
      "relatedProjectSlugs": relatedProjects[]->slug.current
    }`,
    { email }
  )
  if (!p) return null
  return {
    _id: p._id,
    name: p.name ?? '',
    role: p.role ?? '',
    bio: p.bio ?? '',
    photo: img(p.photo, 400),
    links: editableLinks(p.links, p.linkedin),
    longBioMarkdown: {
      es: descriptionToMarkdown(p.longBio?.es),
      en: descriptionToMarkdown(p.longBio?.en),
    },
    researchAreas: {
      es: p.researchAreas?.es ?? [],
      en: p.researchAreas?.en ?? [],
    },
    cv: p.cv ?? '',
    relatedProjectSlugs: (p.relatedProjectSlugs ?? []).filter(Boolean),
  }
}

export async function getPeople(): Promise<PersonData[]> {
  const data = await sanityClient.fetch(
    `*[_type == "person"] | order(order asc, name asc){
      name,
      "slug": slug.current,
      role,
      bio,
      photo,
      linkedin,
      links,
      state
    }`
  )
  return data.map((p: any) => ({
    name: p.name,
    slug: p.slug,
    role: p.role ?? '',
    bio: p.bio ?? '',
    photo: img(p.photo, 600),
    links: resolvePersonLinks(p.links, p.linkedin),
    state: p.state ?? 'active',
  }))
}

// ─── Person detail page (/equipo/[slug]) ────────────────────────────────────

export interface PersonDetailData {
  name: string
  slug: string
  role: string
  photo: string
  longBio: any[] // Portable Text blocks (falls back to the short bio as a single paragraph)
  researchAreas: string[]
  links: PersonLink[]
  cv: string
  relatedProjects: ProjectCardData[]
}

export async function getPersonSlugs(): Promise<string[]> {
  return sanityClient.fetch(
    `*[_type == "person" && state == "active" && defined(slug.current)].slug.current`
  )
}

export async function getPerson(slug: string, locale: Lang = 'es'): Promise<PersonDetailData | null> {
  const p = await sanityClient.fetch(
    `*[_type == "person" && slug.current == $slug][0]{
      name,
      "slug": slug.current,
      role,
      bio,
      photo,
      longBio,
      linkedin,
      researchAreas,
      links,
      "cv": cv.asset->url,
      "projectSlugs": relatedProjects[]->slug.current
    }`,
    { slug }
  )
  if (!p) return null

  const rawLongBio = pickLocaleBlocks(p.longBio, locale)
  const longBio = (Array.isArray(rawLongBio) && rawLongBio.length > 0)
    ? normalizeDescription(rawLongBio)
    : normalizeDescription(p.bio ?? '')

  const projectSlugs = (p.projectSlugs ?? []).filter(Boolean)
  const relatedProjects = projectSlugs.length ? await getProjectsBySlug(projectSlugs, locale) : []

  return {
    name: p.name,
    slug: p.slug,
    role: p.role ?? '',
    photo: img(p.photo, 800),
    longBio,
    researchAreas: pickLocaleStringArray(p.researchAreas, locale),
    links: resolvePersonLinks(p.links, p.linkedin),
    cv: p.cv ?? '',
    relatedProjects,
  }
}

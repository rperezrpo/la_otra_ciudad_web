import { sanityClient } from 'sanity:client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { portableTextToMarkdown } from './portableText'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** Resolve a Sanity image to a URL string, or '' so components fall back to placeholders. */
function img(source: SanityImageSource | undefined, width: number): string {
  if (!source || !(source as any).asset) return ''
  return urlFor(source).width(width).auto('format').fit('max').url()
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
  category: string
  categories: string[]
  summary: string
  heroImage: string
  status: string
  year: number
}

function toCard(p: any): ProjectCardData {
  return {
    title: p.title,
    slug: p.slug,
    category: p.category ?? '',
    categories: p.categories ?? [],
    summary: p.summary ?? '',
    heroImage: img(p.heroImage, 800),
    status: p.status,
    year: p.year,
  }
}

export async function getProjectsBySlug(slugs: string[]): Promise<ProjectCardData[]> {
  const data = await sanityClient.fetch(
    `*[_type == "project" && slug.current in $slugs]{${PROJECT_CARD_FIELDS}}`,
    { slugs }
  )
  // Preserve the order defined in slugs
  const map = new Map(data.map((p: any) => [p.slug, toCard(p)]))
  return slugs.map(s => map.get(s)).filter(Boolean) as ProjectCardData[]
}

export async function getProjectsByCategory(category: string): Promise<ProjectCardData[]> {
  const data = await sanityClient.fetch(
    `*[_type == "project" && categoria_principal == $category] | order(year desc, title asc){${PROJECT_CARD_FIELDS}}`,
    { category }
  )
  return data.map(toCard)
}

export async function getProjects(): Promise<ProjectCardData[]> {
  const data = await sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)] | order(year desc, title asc){${PROJECT_CARD_FIELDS}}`
  )
  return data.map(toCard)
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectCardData[]> {
  const featured = await sanityClient.fetch(
    `*[_type == "project" && featured == true && defined(slug.current)] | order(year desc, title asc)[0...$limit]{${PROJECT_CARD_FIELDS}}`,
    { limit }
  )
  if (featured.length > 0) return featured.map(toCard)
  // Fall back to the most recent projects if none are explicitly featured.
  const recent = await sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)] | order(year desc, title asc)[0...$limit]{${PROJECT_CARD_FIELDS}}`,
    { limit }
  )
  return recent.map(toCard)
}

export interface ProjectDetailData {
  title: string
  slug: string
  category: string
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

export async function getProject(slug: string): Promise<ProjectDetailData | null> {
  const p = await sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      "category": categoria_principal,
      category[],
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
    title: p.title,
    slug: p.slug,
    category: p.category,
    heroImage: img(p.heroImage, 1600),
    description: normalizeDescription(p.description),
    neighborhood: p.neighborhood ?? '',
    partners: p.partners ?? [],
    year: p.year,
    status: p.status,
    gallery: (p.gallery ?? []).map((g: SanityImageSource) => img(g, 1000)).filter(Boolean),
  }
}

// ─── Project editing (self-service form) ─────────────────────────────────────

export interface ProjectListItem {
  slug: string
  title: string
  heroImage: string
  status: string
  year: number
}

export async function getEditableProjects(): Promise<ProjectListItem[]> {
  const data = await sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)] | order(year desc, title asc){
      title, "slug": slug.current, heroImage, status, year
    }`
  )
  return data.map((p: any) => ({
    slug: p.slug,
    title: p.title ?? '(sin título)',
    heroImage: img(p.heroImage, 240),
    status: p.status ?? '',
    year: p.year,
  }))
}

export interface ProjectEditData {
  slug: string
  title: string
  categoria_principal: string
  category: string[]
  summary: string
  descriptionMarkdown: string
  neighborhood: string
  partners: string[]
  year: number | null
  status: string
  featured: boolean
  heroImage: string
  gallery: { key: string; url: string }[]
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
  const descriptionMarkdown = Array.isArray(desc)
    ? portableTextToMarkdown(desc)
    : typeof desc === 'string'
      ? desc
      : ''
  return {
    slug: p.slug,
    title: p.title ?? '',
    categoria_principal: p.categoria_principal ?? '',
    category: p.category ?? [],
    summary: p.summary ?? '',
    descriptionMarkdown,
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

export interface PersonData {
  name: string
  slug: string
  role: string
  bio: string
  photo: string
  linkedin: string
  state: string
}

/** A person's editable profile, matched by their Google Workspace email. */
export interface EditablePerson {
  _id: string
  name: string
  role: string
  bio: string
  linkedin: string
  photo: string // resolved URL for previewing the current photo
}

export async function getPersonByEmail(email: string): Promise<EditablePerson | null> {
  const p = await sanityClient.fetch(
    `*[_type == "person" && lower(email) == lower($email)][0]{
      _id, name, role, bio, linkedin, photo
    }`,
    { email }
  )
  if (!p) return null
  return {
    _id: p._id,
    name: p.name ?? '',
    role: p.role ?? '',
    bio: p.bio ?? '',
    linkedin: p.linkedin ?? '',
    photo: img(p.photo, 400),
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
      state
    }`
  )
  return data.map((p: any) => ({
    name: p.name,
    slug: p.slug,
    role: p.role ?? '',
    bio: p.bio ?? '',
    photo: img(p.photo, 600),
    linkedin: p.linkedin ?? '',
    state: p.state ?? 'active',
  }))
}

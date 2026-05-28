import { sanityClient } from 'sanity:client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

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
  category,
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
  summary: string
  heroImage: string
  status: string
  year: number
}

function toCard(p: any): ProjectCardData {
  return {
    title: p.title,
    slug: p.slug,
    category: p.category,
    summary: p.summary ?? '',
    heroImage: img(p.heroImage, 800),
    status: p.status,
    year: p.year,
  }
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
  description: string
  neighborhood: string
  partners: string[]
  year: number
  status: string
  gallery: string[]
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
      category,
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
    description: p.description ?? '',
    neighborhood: p.neighborhood ?? '',
    partners: p.partners ?? [],
    year: p.year,
    status: p.status,
    gallery: (p.gallery ?? []).map((g: SanityImageSource) => img(g, 1000)).filter(Boolean),
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

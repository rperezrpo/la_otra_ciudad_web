import type { APIRoute } from 'astro';
import { writeClient } from '../../../lib/sanityWrite';
import { getSessionEmail, isProjectEditor } from '../../../lib/access';
import { markdownToPortableText } from '../../../lib/portableText';
import { CATEGORY_KEYS } from '../../../i18n/categories';

export const prerender = false;

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CATEGORIES: string[] = [...CATEGORY_KEYS];
const STATUSES = ['activo', 'completado'];

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const clean = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '');
const uuid = () => crypto.randomUUID();

async function uploadImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Response('Las imágenes deben ser JPG, PNG o WebP.', { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Response('Cada imagen debe pesar menos de 8 MB.', { status: 400 });
  }
  const asset = await writeClient.assets.upload('image', Buffer.from(await file.arrayBuffer()), {
    filename: file.name,
  });
  return { _type: 'image' as const, _key: uuid(), asset: { _type: 'reference' as const, _ref: asset._id } };
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Only flagged project editors may proceed.
  const email = await getSessionEmail(request);
  if (!email) return json({ error: 'Debes iniciar sesión.' }, 401);
  if (!(await isProjectEditor(email))) {
    return json({ error: 'No tienes permisos para editar proyectos.' }, 403);
  }
  if (!import.meta.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN is not set');
    return json({ error: 'El formulario no está configurado. Intenta más tarde.' }, 500);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'No pudimos leer el formulario.' }, 400);
  }

  const slug = clean(form.get('slug'));
  // 2. Locate the project and its current gallery (slug is not editable here).
  const existing = await writeClient.fetch<{ _id: string; gallery?: any[] } | null>(
    `*[_type == "project" && slug.current == $slug][0]{ _id, gallery }`,
    { slug }
  );
  if (!existing?._id) return json({ error: 'No encontramos ese proyecto.' }, 404);

  const title_es = clean(form.get('title_es'));
  const title_en = clean(form.get('title_en'));
  const categoria_principal = clean(form.get('categoria_principal'));
  const summary_es = clean(form.get('summary_es'));
  const summary_en = clean(form.get('summary_en'));
  const md = (name: string) => (typeof form.get(name) === 'string' ? (form.get(name) as string) : '');
  const description_es = md('description_es');
  const description_en = md('description_en');
  const neighborhood = clean(form.get('neighborhood'));
  const yearRaw = clean(form.get('year'));
  const status = clean(form.get('status'));
  const featured = form.get('featured') === 'on' || form.get('featured') === 'true';
  const category = form.getAll('category').filter((c): c is string => typeof c === 'string' && CATEGORIES.includes(c));
  const partners = (clean(form.get('partners')) || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  // 3. Validate. (English fields are optional — the site falls back to Spanish.)
  if (!title_es) return json({ error: 'El título en español es obligatorio.' }, 400);
  if (!CATEGORIES.includes(categoria_principal)) {
    return json({ error: 'Selecciona una categoría principal válida.' }, 400);
  }
  if (status && !STATUSES.includes(status)) {
    return json({ error: 'Estado inválido.' }, 400);
  }
  let year: number | undefined;
  if (yearRaw) {
    year = Number(yearRaw);
    if (!Number.isInteger(year) || year < 1990 || year > 2100) {
      return json({ error: 'El año no es válido.' }, 400);
    }
  }

  // 4. Build the patch. Localized fields are stored as {es, en} objects.
  const set: Record<string, unknown> = {
    title: { es: title_es, en: title_en },
    categoria_principal,
    category,
    description: {
      es: markdownToPortableText(description_es),
      en: markdownToPortableText(description_en),
    },
    status: status || 'activo',
    featured,
  };
  const unset: string[] = [];
  if (summary_es || summary_en) set.summary = { es: summary_es, en: summary_en };
  else unset.push('summary');
  if (neighborhood) set.neighborhood = neighborhood;
  else unset.push('neighborhood');
  if (partners.length) set.partners = partners;
  else unset.push('partners');
  if (year !== undefined) set.year = year;
  else unset.push('year');

  try {
    // 5. Hero image: replace only if a new one was uploaded.
    const hero = form.get('heroImage');
    if (hero instanceof File && hero.size > 0) {
      const uploaded = await uploadImage(hero);
      set.heroImage = { _type: 'image', asset: uploaded.asset };
    }

    // 6. Gallery: keep the existing images the editor didn't remove, then
    //    append any newly uploaded ones.
    const keepKeys = new Set(form.getAll('keepGallery').filter((k): k is string => typeof k === 'string'));
    const kept = (existing.gallery ?? []).filter((g) => keepKeys.has(g._key));
    const newFiles = form.getAll('galleryNew').filter((f): f is File => f instanceof File && f.size > 0);
    const added = [];
    for (const file of newFiles) added.push(await uploadImage(file));
    set.gallery = [...kept, ...added];
  } catch (err) {
    if (err instanceof Response) return json({ error: await err.text() }, err.status);
    console.error('Image upload failed:', err);
    return json({ error: 'No pudimos subir una imagen. Intenta de nuevo.' }, 502);
  }

  // 7. Commit.
  try {
    let patch = writeClient.patch(existing._id).set(set);
    if (unset.length) patch = patch.unset(unset);
    await patch.commit();
  } catch (err) {
    console.error('Sanity patch failed:', err);
    return json({ error: 'No pudimos guardar los cambios. Intenta de nuevo.' }, 502);
  }

  return json({ ok: true }, 200);
};

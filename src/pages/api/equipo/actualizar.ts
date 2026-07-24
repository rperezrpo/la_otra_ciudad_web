import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { writeClient } from '../../../lib/sanityWrite';
import { markdownToPortableText } from '../../../lib/portableText';

// Runs as a Vercel serverless function, not a static page.
export const prerender = false;

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Limit uploads to sensible sizes and to real file types.
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_CV_BYTES = 8 * 1024 * 1024;

const clean = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';
// Markdown fields: read raw (no trim) so intentional leading/trailing
// formatting inside the text survives — same as the project editor.
const md = (form: FormData, name: string) =>
  typeof form.get(name) === 'string' ? (form.get(name) as string) : '';
const uuid = () => crypto.randomUUID();

const isUrl = (v: string) => /^https?:\/\//i.test(v);

const parseLines = (raw: string) =>
  raw.split('\n').map((s) => s.trim()).filter(Boolean);

export const POST: APIRoute = async ({ request }) => {
  // 1. Identity comes from the signed session cookie, never from the client.
  const session = await getSession(request);
  const email = session?.user?.email;
  if (!email) {
    return json({ error: 'Debes iniciar sesión para editar tu perfil.' }, 401);
  }

  if (!import.meta.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN is not set');
    return json({ error: 'El formulario no está configurado. Intenta más tarde.' }, 500);
  }

  // 2. Find *this* person's document by their session email. A user can only
  //    ever resolve to their own profile, so they can't edit anyone else's.
  const person = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "person" && lower(email) == lower($email)][0]{ _id }`,
    { email }
  );
  if (!person?._id) {
    return json(
      {
        error:
          'Aún no existe un perfil del equipo asociado a tu correo. Escribe a Ricardo u otro miembro de la Junta Directiva para que creen uno.',
      },
      404
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'No pudimos leer el formulario.' }, 400);
  }

  const name = clean(form.get('name'));
  const role = clean(form.get('role'));
  const bio = clean(form.get('bio'));
  const linkedin = clean(form.get('linkedin'));
  const orcid = clean(form.get('orcid'));
  const otrosEnlaces = clean(form.get('otrosEnlaces'));
  const longBio_es = md(form, 'longBio_es');
  const longBio_en = md(form, 'longBio_en');
  const researchAreas_es = parseLines(clean(form.get('researchAreas_es')));
  const researchAreas_en = parseLines(clean(form.get('researchAreas_en')));
  const relatedProjectSlugs = form
    .getAll('relatedProjects')
    .filter((s): s is string => typeof s === 'string' && s.length > 0);

  if (!name) {
    return json({ error: 'El nombre no puede quedar vacío.' }, 400);
  }
  if (linkedin && !isUrl(linkedin)) {
    return json({ error: 'El enlace de LinkedIn debe empezar por http:// o https://.' }, 400);
  }
  if (orcid && !isUrl(orcid)) {
    return json({ error: 'El enlace de ORCID debe empezar por http:// o https://.' }, 400);
  }

  // 3. "Otros enlaces": one "Etiqueta, URL" per line.
  const links: { _key: string; type: string; label?: string; url: string }[] = [];
  if (linkedin) links.push({ _key: uuid(), type: 'linkedin', url: linkedin });
  if (orcid) links.push({ _key: uuid(), type: 'orcid', url: orcid });
  for (const line of parseLines(otrosEnlaces)) {
    const sep = line.indexOf(',');
    if (sep === -1) {
      return json({ error: `El enlace "${line}" debe tener el formato "Etiqueta, URL".` }, 400);
    }
    const label = line.slice(0, sep).trim();
    const url = line.slice(sep + 1).trim();
    if (!label || !url) {
      return json({ error: `El enlace "${line}" debe tener el formato "Etiqueta, URL".` }, 400);
    }
    if (!isUrl(url)) {
      return json({ error: `El enlace "${label}" debe empezar por http:// o https://.` }, 400);
    }
    links.push({ _key: uuid(), type: 'custom', label, url });
  }

  // 4. Build the patch. Fields are unset (not blanked) when left empty, except
  //    name which is required.
  const set: Record<string, unknown> = { name };
  const unset: string[] = [];
  for (const [key, value] of Object.entries({ role, bio })) {
    if (value) set[key] = value;
    else unset.push(key);
  }

  if (links.length) set.links = links;
  else unset.push('links');
  // The legacy standalone field is fully replaced by `links` now.
  unset.push('linkedin');

  if (longBio_es.trim() || longBio_en.trim()) {
    set.longBio = {
      es: markdownToPortableText(longBio_es),
      en: markdownToPortableText(longBio_en),
    };
  } else {
    unset.push('longBio');
  }

  if (researchAreas_es.length || researchAreas_en.length) {
    set.researchAreas = { es: researchAreas_es, en: researchAreas_en };
  } else {
    unset.push('researchAreas');
  }

  try {
    // 5. Related projects: resolve the selected slugs to document references.
    if (relatedProjectSlugs.length) {
      const projectDocs = await writeClient.fetch<{ _id: string }[]>(
        `*[_type == "project" && slug.current in $slugs]{ _id }`,
        { slugs: relatedProjectSlugs }
      );
      set.relatedProjects = projectDocs.map((p) => ({
        _key: uuid(),
        _type: 'reference',
        _ref: p._id,
      }));
    } else {
      unset.push('relatedProjects');
    }

    // 6. Optional new photo: upload as an asset, then reference it.
    const photo = form.get('photo');
    if (photo instanceof File && photo.size > 0) {
      if (!ALLOWED_PHOTO_TYPES.includes(photo.type)) {
        return json({ error: 'La foto debe ser JPG, PNG o WebP.' }, 400);
      }
      if (photo.size > MAX_PHOTO_BYTES) {
        return json({ error: 'La foto no puede pesar más de 5 MB.' }, 400);
      }
      const asset = await writeClient.assets.upload('image', Buffer.from(await photo.arrayBuffer()), {
        filename: photo.name,
      });
      set.photo = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    }

    // 7. Optional new CV: upload as a file asset, then reference it.
    const cv = form.get('cv');
    if (cv instanceof File && cv.size > 0) {
      if (cv.type !== 'application/pdf') {
        return json({ error: 'El CV debe ser un archivo PDF.' }, 400);
      }
      if (cv.size > MAX_CV_BYTES) {
        return json({ error: 'El CV no puede pesar más de 8 MB.' }, 400);
      }
      const asset = await writeClient.assets.upload('file', Buffer.from(await cv.arrayBuffer()), {
        filename: cv.name,
      });
      set.cv = { _type: 'file', asset: { _type: 'reference', _ref: asset._id } };
    }
  } catch (err) {
    console.error('Upload failed:', err);
    return json({ error: 'No pudimos subir un archivo. Intenta de nuevo.' }, 502);
  }

  // 8. Patch only this person's document.
  try {
    let patch = writeClient.patch(person._id).set(set);
    if (unset.length) patch = patch.unset(unset);
    await patch.commit();
  } catch (err) {
    console.error('Sanity patch failed:', err);
    return json({ error: 'No pudimos guardar los cambios. Intenta de nuevo.' }, 502);
  }

  return json({ ok: true }, 200);
};

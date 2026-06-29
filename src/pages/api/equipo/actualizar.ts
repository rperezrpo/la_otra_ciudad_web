import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { writeClient } from '../../../lib/sanityWrite';

// Runs as a Vercel serverless function, not a static page.
export const prerender = false;

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Limit photo uploads to a sensible size (5 MB) and to real image types.
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const clean = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';

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

  if (!name) {
    return json({ error: 'El nombre no puede quedar vacío.' }, 400);
  }
  if (linkedin && !/^https?:\/\//i.test(linkedin)) {
    return json({ error: 'El enlace de LinkedIn debe empezar por http:// o https://.' }, 400);
  }

  // 3. Build the patch. Fields are unset (not blanked) when left empty, except
  //    name which is required.
  const set: Record<string, unknown> = { name };
  const unset: string[] = [];
  for (const [key, value] of Object.entries({ role, bio, linkedin })) {
    if (value) set[key] = value;
    else unset.push(key);
  }

  // 4. Optional new photo: upload as an asset, then reference it.
  const photo = form.get('photo');
  if (photo instanceof File && photo.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.includes(photo.type)) {
      return json({ error: 'La foto debe ser JPG, PNG o WebP.' }, 400);
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return json({ error: 'La foto no puede pesar más de 5 MB.' }, 400);
    }
    try {
      const asset = await writeClient.assets.upload(
        'image',
        Buffer.from(await photo.arrayBuffer()),
        { filename: photo.name }
      );
      set.photo = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      };
    } catch (err) {
      console.error('Photo upload failed:', err);
      return json({ error: 'No pudimos subir la foto. Intenta de nuevo.' }, 502);
    }
  }

  // 5. Patch only this person's document.
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

import { createClient } from '@sanity/client';

// The write token is read at RUNTIME from process.env, with a fallback to
// import.meta.env for `astro dev` (where Vite loads .env into import.meta.env
// only). Reading it at runtime matters: with import.meta.env alone the value is
// inlined at build time, so a token missing from the build environment bakes
// `undefined` into the bundle *and* dead-code-eliminates the guard below —
// which is how a missing token turned into a generic "no pudimos guardar"
// instead of a clear "no está configurado".
// The import.meta.env fallback is gated on DEV so the build strips it out:
// otherwise the literal token gets inlined into the deployed bundle.
const devToken = import.meta.env.DEV ? import.meta.env.SANITY_WRITE_TOKEN : undefined;
const rawToken = process.env.SANITY_WRITE_TOKEN ?? devToken ?? '';
// Same quote/whitespace hygiene as the ids below — a token stored as "sk..."
// would authenticate as nobody and every write would 401.
export const SANITY_WRITE_TOKEN: string = rawToken.trim().replace(/^["']|["']$/g, '').trim();

// Env values can arrive wrapped in quotes or padded with whitespace (that is how
// PUBLIC_SANITY_PROJECT_ID was stored in Vercel). An unclean projectId makes
// createClient throw at *import* time, which takes down the whole route with an
// empty 500 before any handler runs — so sanitize, and fall back to the same
// constants astro.config.mjs uses.
const envValue = (v: unknown, fallback: string): string => {
  const cleaned = typeof v === 'string' ? v.trim().replace(/^["']|["']$/g, '').trim() : '';
  return cleaned || fallback;
};

// Server-only Sanity client with a write token. This MUST never be imported
// into client-side code — the token grants edit access to the dataset. It is
// only used from API routes (which run as Vercel serverless functions).
export const writeClient = createClient({
  projectId: envValue(import.meta.env.PUBLIC_SANITY_PROJECT_ID, 'nkzuaihq'),
  dataset: envValue(import.meta.env.PUBLIC_SANITY_DATASET, 'production'),
  apiVersion: '2024-01-01',
  token: SANITY_WRITE_TOKEN,
  useCdn: false,
});

import { createClient } from '@sanity/client';

// Server-only Sanity client with a write token. This MUST never be imported
// into client-side code — the token grants edit access to the dataset. It is
// only used from API routes (which run as Vercel serverless functions).
export const writeClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'nkzuaihq',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

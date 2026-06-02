import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

// projectId is a public identifier — safe to commit (security is via CORS + tokens).
const SANITY_PROJECT_ID = 'nkzuaihq';
const SANITY_DATASET = 'production';

export default defineConfig({
  // Pages prerender to static by default; routes that opt out with
  // `export const prerender = false` run as Vercel serverless functions.
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sanity({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      // Static build — don't use the CDN so builds always get fresh content.
      useCdn: false,
      apiVersion: '2024-01-01',
      studioBasePath: '/admin',
    }),
    react(),
  ],
});

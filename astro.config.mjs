import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// projectId is a public identifier — safe to commit (security is via CORS + tokens).
const SANITY_PROJECT_ID = 'nkzuaihq';
const SANITY_DATASET = 'production';

export default defineConfig({
  site: 'https://laotraciudad.org',
  // Pages prerender to static by default; routes that opt out with
  // `export const prerender = false` run as Vercel serverless functions.
  // (Astro 5+ merged the old `hybrid` mode into `static`.)
  output: 'static',
  adapter: vercel(),
  // Tailwind v4 is wired through its Vite plugin (the @astrojs/tailwind
  // integration was dropped in favour of @tailwindcss/vite).
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sanity({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      // Static build — don't use the CDN so builds always get fresh content.
      useCdn: false,
      apiVersion: '2024-01-01',
      studioBasePath: '/admin',
    }),
    react(),
    sitemap(),
  ],
});

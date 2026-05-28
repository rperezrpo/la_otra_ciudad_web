import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwind from '@astrojs/tailwind';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  ''
);

export default defineConfig({
  integrations: [
    tailwind(),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      // Static build — don't use the CDN so builds always get fresh content.
      useCdn: false,
      apiVersion: '2024-01-01',
      studioBasePath: '/admin',
    }),
    react(),
  ],
});

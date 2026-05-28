import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwind from '@astrojs/tailwind';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

const { PUBLIC_SANITY_PROJECT_ID: _loadEnvProjectId, PUBLIC_SANITY_DATASET: _loadEnvDataset } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  ''
);
// loadEnv reads .env files; fall back to process.env for Vercel's injected vars.
const PUBLIC_SANITY_PROJECT_ID = _loadEnvProjectId || process.env.PUBLIC_SANITY_PROJECT_ID;
const PUBLIC_SANITY_DATASET = _loadEnvDataset || process.env.PUBLIC_SANITY_DATASET;

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

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://abbasquettawala.github.io',
  output: 'static',
  trailingSlash: 'always',
  vite: { build: { chunkSizeWarningLimit: 650 } },
});

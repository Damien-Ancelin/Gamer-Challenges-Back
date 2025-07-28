import { defineConfig } from 'vitest/config';

import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true, // pour utiliser les fonctions expect, describe, etc. sans les importer
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      services: path.resolve(__dirname, './src/services'),
      models: path.resolve(__dirname, './src/models'),
      configs: path.resolve(__dirname, './src/configs'),
      validations: path.resolve(__dirname, './src/validations'),
    },
  },
})
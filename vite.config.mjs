import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ isPreview }) => ({
  root: isPreview ? projectRoot : resolve(projectRoot, 'dist'),
  publicDir: false,
  server: {
    host: '127.0.0.1'
  },
  preview: {
    host: '127.0.0.1'
  }
}));

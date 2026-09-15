import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { plateHubPlugin } from './vite/plugin.ts'

const webRoot = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(webRoot, '..')

export default defineConfig({
  base: './',
  plugins: [react(), plateHubPlugin(repoRoot, webRoot)],
  resolve: {
    alias: {
      '@': path.join(webRoot, 'src'),
    },
  },
  server: {
    fs: {
      allow: [webRoot, repoRoot],
    },
  },
})

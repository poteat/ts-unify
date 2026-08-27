import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

/**
 * A path under a workspace package's `src`, so the aliases resolve to the
 * sources and not to a build.
 *
 * @param pkg the package's folder under `packages`
 * @param file the path under its `src`; the barrel by default
 * @returns the absolute path
 */
const src = (pkg: string, file = 'index.ts') =>
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../packages',
    pkg,
    'src',
    file,
  )

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@ts-unify/core/internal': src('core', 'internal.ts'),
      '@ts-unify/core': src('core'),
      '@ts-unify/engine': src('engine'),
      '@ts-unify/runner': src('runner'),
      '@ts-unify/rules': src('rules'),
      '@ts-unify/playground': src('playground', ''),
      '@/': src('core', '') + path.sep,
      '@': src('core'),
    },
  },
  optimizeDeps: {
    exclude: [
      '@ts-unify/core',
      '@ts-unify/core/internal',
      '@ts-unify/engine',
      '@ts-unify/runner',
      '@ts-unify/rules',
    ],
  },
})

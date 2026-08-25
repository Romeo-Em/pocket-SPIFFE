import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'
import fs from 'fs'

function readOutputName(): string {
  const configPath = path.resolve(__dirname, 'showcases/spiffe-x509/config.tsx')
  const src = fs.readFileSync(configPath, 'utf-8')
  const match = src.match(/outputName:\s*['"]([^'"]+)['"]/)
  return match?.[1] ?? 'showcase'
}

const outputName = readOutputName()

const entry = process.env.SHOWCASE_ENTRY ?? 'index'

const entryMap: Record<string, { html: string; rename?: string }> = {
  index:        { html: 'index.html',        rename: `${outputName}.html` },
  'use-cases':  { html: 'use-cases.html' },
  'user-journey': { html: 'user-journey.html' },
}

const current = entryMap[entry] ?? entryMap['index']

function renameOutput(): import('vite').Plugin {
  return {
    name: 'rename-output',
    closeBundle() {
      if (!current.rename) return
      const distDir = path.resolve(__dirname, 'dist')
      const src = path.join(distDir, current.html)
      const dest = path.join(distDir, current.rename)
      if (fs.existsSync(src)) {
        fs.renameSync(src, dest)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    renameOutput(),
  ],
  resolve: {
    alias: {
      '@z/ds': path.resolve(__dirname, '../storybook/tokens'),
      '@z/wireframes': path.resolve(__dirname, '../storybook/stories/wireframes'),
    },
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, current.html),
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})

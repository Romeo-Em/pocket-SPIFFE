import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'
import fs from 'fs'

// Read the outputName from the active showcase config.
function readOutputName(): string {
  const configPath = path.resolve(__dirname, 'showcases/spiffe-x509/config.tsx')
  const src = fs.readFileSync(configPath, 'utf-8')
  const match = src.match(/outputName:\s*['"]([^'"]+)['"]/)
  return match?.[1] ?? 'showcase'
}

const outputName = readOutputName()

// Plugin that renames index.html to the configured output name after build
function renameOutput(): import('vite').Plugin {
  return {
    name: 'rename-output',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const src = path.join(distDir, 'index.html')
      const dest = path.join(distDir, `${outputName}.html`)
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
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})

import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'

const config: StorybookConfig = {
  stories: [
    '../stories/wireframes/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@z/ds': path.resolve(__dirname, '../tokens'),
    }

    // PostCSS — autoprefixer only
    config.css = config.css || {}
    config.css.postcss = {
      plugins: [
        autoprefixer(),
      ],
    }

    // Ensure React automatic JSX runtime is configured
    config.plugins = config.plugins || []
    config.plugins.push(react({ jsxRuntime: 'automatic' }))
    return config
  },
}

export default config

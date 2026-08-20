import type { Preview } from '@storybook/react'
import React from 'react'

// Import design tokens (grayscale wireframe system)
import '@z/ds/index.css'

// Import the browser chrome wrapper
import { WireframeChrome } from '../stories/wireframes/WireframeChrome'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const chromeParams = context.parameters?.wireframeChrome || {};
      const hideChrome = chromeParams.hide === true;
      const title = chromeParams.title || context.title?.split('/').pop() || 'Platform';
      const height = chromeParams.height || '85vh';

      return React.createElement(
        WireframeChrome,
        { hideChrome, title, height },
        React.createElement(Story),
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#f8f8f8' },
        { name: 'white', value: '#ffffff' },
        { name: 'light-gray', value: '#f4f4f4' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview

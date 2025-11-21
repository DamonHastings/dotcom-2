import type { Preview } from '@storybook/react';

// Polyfill process for Next.js client code when running under Storybook Vite
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
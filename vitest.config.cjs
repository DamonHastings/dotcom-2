const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    // Exclude Next.js build artifacts and `node_modules` from test discovery to avoid false positives
    exclude: ['**/.next/**', '**/node_modules/**'],
  },
});

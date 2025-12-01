module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
    typography: {
      DEFAULT: {
        css: {
          a: {
            textDecoration: 'underline',
            fontWeight: '600',
            color: 'inherit',
          },
          p: {
            marginTop: '5px',
            marginBottom: '5px',
          },
          h4: {
            marginBottom: '0.5em',
            fontWeight: '600',
            fontSize: '1.25em',
            lineHeight: '1.25',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

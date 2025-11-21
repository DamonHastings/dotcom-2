import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Do NOT use next/font in _document; Next.js renders font styles differently and throws errors.
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

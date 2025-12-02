import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Do NOT use next/font in _document; Next.js renders font styles differently and throws errors.
  return (
    <Html lang="en">
      <Head>
        {/* Move page-level font preload here so it loads across the site */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

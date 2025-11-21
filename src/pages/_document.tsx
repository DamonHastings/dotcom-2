import { Html, Head, Main, NextScript } from 'next/document';
import { Inter } from 'next/font/google';

// Re-declare Inter here so the font variables/class apply at the html root during SSR.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function Document() {
  return (
    <Html className={`${inter.variable} ${inter.className}`} lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

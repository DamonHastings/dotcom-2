import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { Inter, Fraunces } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
  variable: '--font-fraunces',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${inter.className} ${fraunces.variable}`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

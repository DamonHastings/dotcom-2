import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

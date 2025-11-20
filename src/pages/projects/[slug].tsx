import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

type Props = {
  slug: string;
};

export default function ProjectPage({ slug }: Props) {
  return (
    <>
      <Head>
        <title>{`Project: ${slug}`}</title>
      </Head>
      <main className="min-h-screen px-6 py-12">
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Project: {slug}</h2>
          <p>Project detail placeholder.</p>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  return {
    props: { slug },
    revalidate: 60,
  };
};

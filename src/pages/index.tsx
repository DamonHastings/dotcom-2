import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home — Portfolio</title>
        <meta name="description" content="Portfolio site" />
      </Head>
      <main className="min-h-screen px-6 py-12">
        <section className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Hello — I'm a software engineer</h1>
          <p className="text-lg text-muted-foreground">This is a starter portfolio built with Next.js and Tailwind CSS.</p>
        </section>
      </main>
    </>
  );
}

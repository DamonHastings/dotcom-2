import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About — Portfolio</title>
      </Head>
      <main className="min-h-screen px-6 py-12">
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">About Me</h2>
          <p className="text-base text-muted-foreground">Short biography goes here.</p>
        </section>
      </main>
    </>
  );
}

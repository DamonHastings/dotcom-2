import Head from 'next/head';
import { fetchSiteInfo, SiteInfo } from '@/lib/sanity';
import type { GetStaticProps } from 'next';

export default function About({ site }: { site: SiteInfo | null }) {
  return (
    <>
      <Head>
        <title>About — {site?.title || 'Portfolio'}</title>
      </Head>
      <main className="min-h-screen px-6 py-12">
        <section className="max-w-3xl mx-auto space-y-6">
          <header>
            <h2 className="text-3xl font-semibold mb-2">About Me</h2>
            {site?.subtitle && <p className="text-lg text-muted-foreground">{site.subtitle}</p>}
          </header>
          {site?.summary && (
            <p className="text-base leading-relaxed whitespace-pre-line text-muted-foreground">
              {site.summary}
            </p>
          )}
          {site?.services?.length ? (
            <div>
              <h3 className="text-xl font-semibold mb-3">Services</h3>
              <ul className="space-y-3">
                {site.services.map((s) => (
                  <li key={s.title} className="border border-border rounded p-4">
                    <h4 className="font-medium">{s.title}</h4>
                    {s.description && (
                      <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {site?.resumeUrl && (
            <div>
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                View Resume (PDF)
              </a>
            </div>
          )}
          {site?.contactEmail && (
            <p className="text-sm text-muted-foreground">
              Contact: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </p>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const site = await fetchSiteInfo();
  return {
    props: { site },
    revalidate: 60,
  };
};

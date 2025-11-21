import Head from 'next/head';
import { fetchSiteInfo, SiteInfo } from '@/lib/sanity';
import type { GetStaticProps } from 'next';

export default function Skills({ site }: { site: SiteInfo | null }) {
  const skills = site?.skills || [];
  const categories = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));
  return (
    <>
      <Head>
        <title>Skills — {site?.title || 'Portfolio'}</title>
      </Head>
      <main className="min-h-screen px-6 py-12">
        <section className="max-w-4xl mx-auto space-y-8">
          <header>
            <h2 className="text-3xl font-semibold mb-2">Skills</h2>
            {site?.subtitle && <p className="text-lg text-muted-foreground">{site.subtitle}</p>}
          </header>
          {categories.length ? (
            <div className="space-y-10">
              {categories.map((cat) => (
                <div key={cat}>
                  <h3 className="text-xl font-semibold mb-3">{cat}</h3>
                  <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {skills
                      .filter((s) => s.category === cat)
                      .map((s) => (
                        <li key={s.name} className="border border-border rounded p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{s.name}</span>
                            {s.level && (
                              <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                                {s.level}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No skills added yet.</p>
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

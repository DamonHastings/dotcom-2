import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import SummaryTimeline from '@/components/SummaryTimeline';
import { fetchExperiences, type Experience } from '@/lib/sanity';
import { GetStaticProps } from 'next';

type BioProps = {
  timelineItems: {
    period: string;
    company: string;
    role: string;
    summary: string;
  }[];
};

export default async function Bio() {
  const experiences: Experience[] = await fetchExperiences();
  const timelineItems: {
    period: string;
    company: string;
    role: string;
    summary: string;
  }[] = experiences.map((e) => ({
    period: formatPeriod(e),
    company: e.company || '—',
    role: e.role ?? '',
    summary: e.resume?.shortSummary ?? e.summary ?? '',
  }));
  const fallbackItems = [
    {
      period: '2021 - 2025',
      company: 'Vouch Insurance',
      role: 'Senior Software Engineer',
      summary:
        'Built and improved full‑stack insurance features at scale, focusing on frontend architecture, reliability, and cross‑functional delivery.',
    },
    {
      period: '2020 - 2021',
      company: 'Parsley Health',
      role: 'Senior Software Engineer',
      summary:
        'Delivered full‑stack features for care delivery and patient workflows, improving reliability and developer velocity.',
    },
    {
      period: '2018 - 2020',
      company: 'Acme Co',
      role: 'Software Engineer',
      summary: 'Worked across web and backend systems to ship scalable features.',
    },
  ];
  const displayedItems = timelineItems && timelineItems.length > 0 ? timelineItems : fallbackItems;
  return (
    <>
      <Head>
        <title>Damon Hastings — Bio</title>
        <meta name="description" content="Damon Hastings — Software Engineer & Media Designer" />
        {/* Load Fraunces from Google Fonts and prefer swap for performance. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main
        className="min-h-screen bg-black text-white"
        style={{
          fontFamily:
            "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div className="max-w-6xl mx-auto pt-10 pb-2 text-md">
          <div className="grid grid-cols-12 gap-8">
            {/* Left content */}
            <div className="col-span-7">
              <section className="prose prose-invert max-w-none">
                {/* <h2
                  className="text-3xl mb-4"
                  style={{
                    fontFamily: 'var(--font-fraunces, serif)',
                  }}
                >
                  15 years of helping innovative teams drive goals through engineering & design.
                </h2> */}
                <p className="mb-6">
                  Since age 10, I’ve had a passion for understanding how technology can be leveraged
                  to solve human problems. That passion drove me to study programming, business
                  administration, and economics. I’ve built a skillset that empowers me to
                  effectively assess business goals, customer needs, and technological capabilities.
                </p>
                <p className="mb-6">
                  I’ve worked across architecture, nonprofit, healthcare innovation, small business,
                  and high-growth startups, executing mission-critical software projects and
                  applying creative strategy to diverse business initiatives. I’ve learned how great
                  teams build, ship, and scale high impact technological solutions. I’ve learned how
                  small ideas grow into productive and profitable operations.
                </p>
                <p>
                  Today, I apply this experience and expertise as both a senior-level engineer and a
                  creative producer across mediums. I am excited about helping businesses, service
                  providers, and innovators find creative and technical solutions to drive their
                  missions forward. Think you might have a need for my expertise? Just reach out.
                </p>
                <p className="mt-6">
                  Think you might have a need for my expertise? Just reach out.
                </p>

                <div className="mt-8 space-y-2">
                  <a
                    className="text-cyan-400 hover:text-cyan-300 block"
                    href="mailto:damonjhastings@gmail.com"
                  >
                    damonjhastings@gmail.com
                  </a>
                  <a
                    className="text-cyan-400 hover:text-cyan-300 block"
                    href="https://www.linkedin.com/in/damonjhastings"
                    target="_blank"
                    rel="noreferrer"
                  >
                    linkedin.com/in/damonjhastings
                  </a>
                  <a
                    className="text-cyan-400 hover:text-cyan-300 block"
                    href="https://x.com/damon_hastings"
                    target="_blank"
                    rel="noreferrer"
                  >
                    x.com/damon_hastings
                  </a>
                </div>
              </section>
            </div>

            {/* Right sidebar */}
            <aside className="col-span-5 hidden md:block">
              <nav
                className="flex flex-col items-end gap-4 text-gray-300"
                style={{ fontFamily: 'var(--font-fraunces, serif)' }}
              >
                {/* Summary timeline component */}
                {/* Imported dynamically below to keep render simple */}
              </nav>
              <div className="mt-8">
                {/* Summary timeline */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                {/* We'll import the component normally */}
                <SummaryTimeline items={displayedItems} />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function formatPeriod(exp: Experience) {
  const parseYear = (d?: string | null) => {
    if (!d) return null;
    const y = new Date(d).getFullYear();
    return Number.isFinite(y) ? String(y) : null;
  };
  const start = parseYear(exp.startDate) || '';
  const end = parseYear(exp.endDate) || (exp.endDate === null ? 'Present' : '');
  if (start && end) return `${start} - ${end}`;
  if (start && !end) return `${start} - Present`;
  if (!start && end) return `${end}`;
  return '';
}

export const getStaticProps: GetStaticProps<BioProps> = async () => {
  try {
    const experiences = await fetchExperiences();
    const timelineItems = experiences.map((e) => ({
      period: formatPeriod(e),
      company: e.company || '—',
      role: e.role ?? '',
      summary: e.resume?.shortSummary ?? e.summary ?? '',
    }));
    return { props: { timelineItems }, revalidate: 60 };
  } catch (err) {
    // On error, return an empty timeline
    return { props: { timelineItems: [] } };
  }
};

import Head from 'next/head';
import Image from 'next/image';
import ExperienceList from '@/components/ExperienceList';
import CareerHighlights from '@/components/CareerHighlights';
import CurrentGoals from '@/components/CurrentGoals';
import {
  fetchProjects,
  fetchSiteInfo,
  fetchLanding,
  fetchExperiences,
  fetchFeatureFlag,
  urlFor,
  type SiteInfo,
  type LandingPage,
} from '@/lib/sanity';
import Timeline from '@/components/Timeline';
import ContactSection from '@/components/ContactSection';
import { type FeatureFlag } from '@/lib/sanity';

interface HomeProps {
  projects: {
    _id: string;
    title: string;
    subtitle: string;
    slug?: { current: string };
    status?: string;
    coverImage?: { _type?: 'image'; asset?: { _ref: string } };
  }[];
  site: SiteInfo | null;
  landing: LandingPage | null;
  experiences: import('@/lib/sanity').Experience[];
  featureFlags: { [key: string]: FeatureFlag };
}

type TimelineExperience = Omit<import('@/lib/sanity').Experience, 'technologies'> & {
  technologies?: string[];
};

export async function getStaticProps() {
  let projects = [] as HomeProps['projects'];
  let site: SiteInfo | null = null;
  let landing: LandingPage | null = null;
  let experiences: HomeProps['experiences'] = [] as HomeProps['experiences'];
  let featureFlags: { [key: string]: FeatureFlag } = {};
  try {
    projects = await fetchProjects();
    console.log(`Fetched ${projects.length} projects for homepage`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch projects from Sanity', e);
  }
  try {
    site = await fetchSiteInfo();
    console.log(`Fetched siteInfo for homepage: ${site ? 'found' : 'not found'}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch siteInfo from Sanity', e);
  }
  try {
    landing = await fetchLanding();
    console.log(`Fetched landingPage for homepage: ${landing ? 'found' : 'not found'}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch landingPage from Sanity', e);
  }
  try {
    experiences = await fetchExperiences();
    console.log(`Fetched ${experiences.length} experiences for homepage`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch experiences from Sanity', err);
  }
  try {
    const emailFormFlag = await fetchFeatureFlag('emailFormFlag');
    featureFlags = { emailFormFlag: emailFormFlag ?? ({} as FeatureFlag) };
    console.log(
      `Feature Flag - emailFormFlag: ${
        featureFlags.emailFormFlag?.enabled ? 'enabled' : 'disabled'
      }`
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch feature flag from Sanity', err);
  }
  return {
    props: { projects, site, landing, experiences, featureFlags },
    revalidate: 60, // ISR every minute
  };
}

export default function WorkHistory({
  site,
  landing,
  experiences,
  featureFlags,
}: Pick<HomeProps, 'site' | 'landing' | 'experiences' | 'featureFlags'>) {
  const ptToPlain = (val: unknown) => {
    if (!val) return '';
    if (!Array.isArray(val)) return String(val);
    return (val as unknown[])
      .map((block) => {
        const children = (block as Record<string, unknown>)?.children as unknown[] | undefined;
        return (children ?? [])
          .map((c) => String((c as Record<string, unknown>)?.text ?? ''))
          .filter(Boolean)
          .join(' ');
      })
      .filter(Boolean)
      .join('\n\n');
  };
  // trimmed unused page helpers (kept minimal for lint cleanliness)
  const timelineExperiences: TimelineExperience[] = experiences.map((e) => ({
    ...e,
    technologies: e.technologies ?? undefined,
  }));

  const heroImageUrl = landing?.heroImage ? urlFor(landing.heroImage).width(1200).url() : null;
  const heroImageAlt = landing?.heroImage?.alt || site?.title || 'Hero image';

  return (
    <>
      <Head>
        <title>
          {landing?.seoTitle ||
            (site?.title ? `${site.title} — Portfolio` : 'Panta — Product & Design')}
        </title>
        <meta
          name="description"
          content={
            landing?.seoDescription ||
            (Array.isArray(landing?.summary) ? ptToPlain(landing.summary) : landing?.summary) ||
            site?.summary ||
            'Panta portfolio showcasing interface design, interaction patterns, brand development, and experimentation systems.'
          }
        />
      </Head>
      <main className="p-6">
        <section className="grid grid-cols-12 gap-6 items-start max-w-6xl mx-auto relative">
          {heroImageUrl && (
            <div className="md:bottom-0 md:mx-auto top-10 md:top-5 col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-1 md:gap-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <div className="opacity-90 rounded mb-2 overflow-hidden">
                  <Image
                    src={heroImageUrl as string}
                    alt=""
                    width={800}
                    height={600}
                    className="rounded"
                  />
                </div>
                <div className="sr-only">{heroImageAlt}</div>
              </div>
              <div className="text-xs md:mt-6 col-span-1 md:col-span-2 mt-2">
                <ContactSection contactEmail={site?.contactEmail} resumeUrl={site?.resumeUrl} />
              </div>
            </div>
          )}
          <div className="md:block md:col-span-6 col-span-12">
            <h1 className="text-4xl font-extrabold">{site?.title}</h1>
            <h2 className="text-xl font-medium">
              15 years of Customer-Focused Engineering and Design
            </h2>
            <Timeline experiences={timelineExperiences} startAtEnd topN={10} stepMs={100} />
          </div>
          <div className="col-span-12 md:col-span-4 space-y-4 space-x- z-10"></div>
          <div className="hidden md:block md:col-span-2">{/* Spacer for layout balance */}</div>
        </section>
        <CareerHighlights />
        {featureFlags.emailFormFlag.enabled ? <CurrentGoals /> : null}
        <ExperienceList experiences={experiences} />
      </main>
    </>
  );
}

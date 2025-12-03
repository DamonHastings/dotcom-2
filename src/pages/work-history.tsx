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
  urlFor,
  type SiteInfo,
  type LandingPage,
} from '@/lib/sanity';
import Timeline from '@/components/Timeline';
import ContactSection from '@/components/ContactSection';
// Image import removed (unused)

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
}

type TimelineExperience = Omit<import('@/lib/sanity').Experience, 'technologies'> & {
  technologies?: string[];
};

export async function getStaticProps() {
  let projects = [] as HomeProps['projects'];
  let site: SiteInfo | null = null;
  let landing: LandingPage | null = null;
  let experiences: HomeProps['experiences'] = [] as HomeProps['experiences'];
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
  return {
    props: { projects, site, landing, experiences },
    revalidate: 60, // ISR every minute
  };
}

export default function WorkHistory({
  site,
  landing,
  experiences,
}: Pick<HomeProps, 'site' | 'landing' | 'experiences'>) {
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
          {/* Heading overlay — use relative positioning on small screens and absolute on md */}
          {/* <div className="relative md:absolute md:bottom-0 md:right-0 bg-transparent md:bg-white md:p-5 md:px-8 md:pl-6">
              <HeroHeading lines={heroLines} />
            </div> */}
          {/* Heading overlay — use relative positioning on small screens and absolute on md */}
          {/* <div className="relative md:absolute md:bottom-0 md:right-0 bg-transparent md:bg-white md:p-5 md:px-8 md:pl-6">
              <HeroHeading lines={heroLines} />
            </div> */}

          {/* <div className="col-span-12 md:col-span-4 space-y-8 z-10 mb-10">
            <LeadText heading={headingTagline}>{introSummary}</LeadText>
            <CTAList primary={primaryCtas} secondary={secondaryCtas} />
          </div> */}
          <div className="hidden md:block md:col-span-2">{/* Spacer for layout balance */}</div>
        </section>

        <CareerHighlights />
        <CurrentGoals />

        <ExperienceList experiences={experiences} />

        {/* <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-2">Things I've Done</h2>
          <CategoryTabs categories={['Featured', 'Product', 'Design', 'Systems']} />
        </section>

        <section className="max-w-6xl mx-auto mb-24">
          <ProjectCarousel projects={featuredProjects} />
        </section> */}
      </main>
    </>
  );
}

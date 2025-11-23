import Head from 'next/head';
import HeroHeading from '@/components/HeroHeading';
import LeadText from '@/components/LeadText';
import CTAList from '@/components/CTAList';
import CategoryTabs from '@/components/CategoryTabs';
import ProjectCarousel from '@/components/ProjectCarousel';
import ExperienceList from '@/components/ExperienceList';
import CareerHighlights from '@/components/CareerHighlights';
import SkillTimeline, { type TimelineEntry } from '@/components/SkillTimeline';
import {
  fetchProjects,
  fetchSiteInfo,
  fetchLanding,
  fetchExperiences,
  urlFor,
  type SiteInfo,
  type LandingPage,
} from '@/lib/sanity';
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

export default function Home({ projects, site, landing, experiences }: HomeProps) {
  console.log('Hero Heading:', landing?.heroHeading);
  const heroLines = landing?.heroHeading?.length
    ? landing.heroHeading
    : site?.title
    ? [site.title, site.subtitle || 'Digital Product', 'Experiments & Craft']
    : ['Software Engineer.', 'Digital Artist.', 'Creative Producer.'];

  const headingTagline = landing?.heroTagline || site?.subtitle || 'Product & Design at Panta';
  const introSummary =
    landing?.summary ||
    site?.summary ||
    'A collection of work exploring interface design, interaction patterns, brand development, and the systems that support rapid experimentation.';
  const primaryCtas = landing?.primaryCtas?.length
    ? landing.primaryCtas
    : [
        // { label: 'Latest case study', href: '/projects/latest' },
        // { label: 'Design system', href: '/projects/design-system' },
        // { label: 'Get in touch', href: '/contact' },
      ];
  const secondaryCtas = landing?.secondaryCtas?.length
    ? landing.secondaryCtas
    : [
        { label: 'About Panta', href: '/about' },
        { label: 'All projects', href: '/projects' },
      ];

  const timeline: TimelineEntry[] = [
    { year: 2015, title: 'Junior SWE', skills: { JavaScript: 40, React: 20, Design: 10 } },
    { year: 2018, title: 'Mid SWE', skills: { JavaScript: 70, React: 60, Design: 25 } },
    { year: 2022, title: 'Senior SWE', skills: { JavaScript: 90, React: 85, Design: 50 } },
  ];
  const featuredProjects = (
    landing?.featuredProjects?.length ? landing.featuredProjects : projects
  ).map((p) => ({
    title: p.title,
    subtitle: p.subtitle || 'Panta',
    coverImage: p.coverImage,
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
            landing?.summary ||
            site?.summary ||
            'Panta portfolio showcasing interface design, interaction patterns, brand development, and experimentation systems.'
          }
        />
      </Head>
      <main className="px-6">
        <section className="relative max-w-6xl mx-auto grid grid-cols-12 gap-6 md:gap-12 mt-0 mb-0 md:mb-5 md:mt-5">
          {/* Hero - 12 column grid: left 8 cols (visual + heading), right 4 cols (lead + ctas) */}

          <div className="col-span-12 md:col-span-8 relative">
            {/* Decorative background image positioned bottom-left for md+ */}
            {/* {heroImageUrl && (
              <div className="pointer-events-none md:absolute md:bottom-0 md:left-0">
                <img
                  src={heroImageUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-full md:w-[610px] opacity-90 rounded"
                />
                <div className="sr-only">{heroImageAlt}</div>
              </div>
            )} */}

            {/* Heading overlay — use relative positioning on small screens and absolute on md */}
            <div className="relative md:absolute md:bottom-4 md:left-6 bg-transparent md:bg-white md:p-5 md:pl-8">
              <HeroHeading lines={heroLines} />
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-8 z-10 mb-10">
            <LeadText heading={headingTagline}>{introSummary}</LeadText>
            <CTAList primary={primaryCtas} secondary={secondaryCtas} />
          </div>
        </section>

        <CareerHighlights />
        <SkillTimeline timeline={timeline} />

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

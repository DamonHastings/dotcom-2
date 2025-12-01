import Head from 'next/head';
import HeroHeading from '@/components/HeroHeading';
import LeadText from '@/components/LeadText';
import CTAList from '@/components/CTAList';
import CategoryTabs from '@/components/CategoryTabs';
import ProjectCarousel from '@/components/ProjectCarousel';
import ExperienceList from '@/components/ExperienceList';
import CareerHighlights from '@/components/CareerHighlights';
import CurrentGoals from '@/components/CurrentGoals';
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
import Timeline from '@/components/Timeline';
import { IconDuplicate, IconEnvelope, IconFileLines } from '@/components/icons';
import Link from 'next/link';
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

export default function WorkHistory({ projects, site, landing, experiences }: HomeProps) {
  console.log('Hero Heading:', landing?.heroHeading);
  const ptToPlain = (val: any) => {
    if (!val) return '';
    if (!Array.isArray(val)) return String(val);
    return val
      .map((block: any) =>
        (block?.children || [])
          .map((c: any) => c?.text ?? '')
          .filter(Boolean)
          .join(' ')
      )
      .filter(Boolean)
      .join('\n\n');
  };
  const heroLines = landing?.heroHeading?.length
    ? landing.heroHeading
    : site?.title
    ? [site.title, site.subtitle || 'Digital Product', 'Experiments & Craft']
    : ['Software Engineer.', 'Digital Artist.', 'Creative Producer.'];

  const headingTagline = landing?.heroTagline || site?.subtitle || 'Product & Design at Panta';
  const introSummary =
    (Array.isArray(landing?.summary) ? ptToPlain(landing?.summary) : landing?.summary) ||
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
  // Normalize experiences so 'technologies' is undefined instead of null (matches Timeline.Experience)
  const timelineExperiences: TimelineExperience[] = experiences.map((e) => ({
    ...e,
    technologies: e.technologies ?? undefined,
  }));
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
            (Array.isArray(landing?.summary) ? ptToPlain(landing.summary) : landing?.summary) ||
            site?.summary ||
            'Panta portfolio showcasing interface design, interaction patterns, brand development, and experimentation systems.'
          }
        />
      </Head>
      <main className="p-6">
        <section className="grid grid-cols-12 gap-6 items-start max-w-6xl mx-auto relative">
          {heroImageUrl && (
            <div className="md:bottom-0 md:mx-auto top-10 md:top-5 col-span-4">
              <img
                src={heroImageUrl}
                alt=""
                aria-hidden="true"
                className="w-full md:w-[100%] opacity-90 rounded mb-2"
              />
              <div className="sr-only">{heroImageAlt}</div>
              <div className="text-xs mt-6">
                <ContactSection contactEmail={site?.contactEmail} resumeUrl={site?.resumeUrl} />
              </div>
            </div>
          )}
          <div className="hidden md:block md:col-span-6">
            <h1 className="text-4xl font-extrabold mt-3">{site?.title}</h1>
            <h2 className="text-xl font-medium">
              15 years of Customer-Focused Engineering and Design
            </h2>
            <Timeline experiences={timelineExperiences} startAtEnd topN={10} stepMs={500} />
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

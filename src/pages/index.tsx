import Head from 'next/head';
import HeroHeading from '@/components/HeroHeading';
import LeadText from '@/components/LeadText';
import CTAList from '@/components/CTAList';
import CategoryTabs from '@/components/CategoryTabs';
import ProjectCarousel from '@/components/ProjectCarousel';
import ExperienceList from '@/components/ExperienceList';
import CareerHighlights from '@/components/CareerHighlights';
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
        { label: 'Latest case study', href: '/projects/latest' },
        { label: 'Design system', href: '/projects/design-system' },
        { label: 'Get in touch', href: '/contact' },
      ];
  const secondaryCtas = landing?.secondaryCtas?.length
    ? landing.secondaryCtas
    : [
        { label: 'About Panta', href: '/about' },
        { label: 'All projects', href: '/projects' },
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
      <main className="px-6 py-16 md:py-10">
        <section className="relative max-w-6xl mx-auto grid md:gap-12 md:grid-cols-2 gap-12 mb-20 mt-20">
          {/* Background hero image positioned bottom-left */}
          {console.log('Rendering hero image:', heroImageUrl)}
          {true ? (
            <>
              <div className="pointer-events-none absolute bottom-0 left-0">
                {/* Decorative background image: hide from assistive tech and provide sr-only text for context */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImageUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-64 md:w-[610px] opacity-90 rounded"
                />
                <div className="sr-only">{heroImageAlt}</div>
                <div className="absolute bottom-0 left-0 bg-white w-full  p-5 pl-8 left-6">
                  <HeroHeading lines={heroLines} />
                </div>
              </div>
              <div>{/* left column intentionally empty when background image present */}</div>
            </>
          ) : (
            <HeroHeading lines={heroLines} />
          )}

          <div className="space-y-8 z-10">
            {/* {heroImageUrl && <HeroHeading lines={heroLines} />} */}
            <LeadText heading={headingTagline}>{introSummary}</LeadText>
            <CTAList primary={primaryCtas} secondary={secondaryCtas} />
          </div>
        </section>

        <CareerHighlights />

        <ExperienceList experiences={experiences} />

        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-2">Things I've Done</h2>
          <CategoryTabs categories={['Featured', 'Product', 'Design', 'Systems']} />
        </section>

        <section className="max-w-6xl mx-auto mb-24">
          <ProjectCarousel projects={featuredProjects} />
        </section>
      </main>
    </>
  );
}

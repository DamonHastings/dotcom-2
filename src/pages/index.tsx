import Head from 'next/head';
import HeroHeading from '@/components/HeroHeading';
import LeadText from '@/components/LeadText';
import CTAList from '@/components/CTAList';
import CategoryTabs from '@/components/CategoryTabs';
import ProjectCarousel from '@/components/ProjectCarousel';
import { fetchProjects } from '@/lib/sanity';
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
}

export async function getStaticProps() {
  let projects = [] as HomeProps['projects'];
  try {
    projects = await fetchProjects();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch projects from Sanity', e);
  }
  return {
    props: { projects },
    revalidate: 60, // ISR every minute
  };
}

export default function Home({ projects }: HomeProps) {
  return (
    <>
      <Head>
        <title>Panta — Product & Design</title>
        <meta name="description" content="Panta portfolio and product work" />
      </Head>
      <main className="px-6 py-16 md:py-24">
        <section className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 md:gap-20 mb-20">
          <div>
            <HeroHeading lines={['Software Engineer.', 'Digital Artist.', 'Creative Producer.']} />
          </div>
          <div className="space-y-8">
            <LeadText heading="Product & Design at Panta">
              A collection of work exploring interface design, interaction patterns, brand
              development, and the systems that support rapid experimentation.
            </LeadText>
            <CTAList
              primary={[
                { label: 'Latest case study', href: '/projects/latest' },
                { label: 'Design system', href: '/projects/design-system' },
                { label: 'Get in touch', href: '/contact' },
              ]}
              secondary={[
                { label: 'About Panta', href: '/about' },
                { label: 'All projects', href: '/projects' },
              ]}
            />
          </div>
        </section>

        <section className="max-w-6xl mx-auto mb-12">
          <CategoryTabs categories={['Featured', 'Product', 'Design', 'Systems']} />
        </section>

        <section className="max-w-6xl mx-auto mb-24">
          <ProjectCarousel
            projects={projects.map((p) => ({
              title: p.title,
              subtitle: p.subtitle || 'Panta',
              coverImage: p.coverImage,
            }))}
          />
        </section>
      </main>
    </>
  );
}

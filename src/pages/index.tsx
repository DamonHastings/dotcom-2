import Head from 'next/head';
import HeroHeading from '@/components/HeroHeading';
import LeadText from '@/components/LeadText';
import CTAList from '@/components/CTAList';
import CategoryTabs from '@/components/CategoryTabs';
import ProjectCarousel from '@/components/ProjectCarousel';

// Sample project data for grid (replace with real data later)
const projects = [
  { title: 'Project 1', subtitle: 'Panta | Brand Design' },
  { title: 'Project 2', subtitle: 'Panta | Web App' },
  { title: 'Project 3', subtitle: 'Panta | Marketing Site' },
  { title: 'Project 4', subtitle: 'Panta | Mobile UX' },
  { title: 'Project 5', subtitle: 'Panta | Automation' },
  { title: 'Project 6', subtitle: 'Panta | Data Viz' },
  { title: 'Project 7', subtitle: 'Panta | Design System' },
  { title: 'More Work', subtitle: 'Browse All', arrow: true },
];

export default function Home() {
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
          <ProjectCarousel projects={projects} intervalMs={3500} />
        </section>
      </main>
    </>
  );
}

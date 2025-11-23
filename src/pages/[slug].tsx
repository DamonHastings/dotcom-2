import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import LearnMorePage from '../components/LearnMorePage';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/lib/sanity';

type Props = {
  title?: string | null;
  imageSrc: string;
  imageAlt?: string;
  content?: any[];
  hero?: any;
  sections?: any[];
};

export default function SlugPage({ title, imageSrc, imageAlt, content, hero, sections }: Props) {
  return (
    <>
      <Head>
        <title>{title ? `${title}` : 'Page'}</title>
      </Head>
      <main>
        <LearnMorePage
          title={title ?? undefined}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          content={content}
          hero={hero}
          sections={sections}
          unoptimized
        />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // We'll use fallback blocking and generate pages on demand
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = String(context.params?.slug || '');

  try {
    // Prefer flexible pages
    const flexibleQuery = `*[_type == "flexiblePage" && slug.current == $slug][0]{title, slug, hero, sections}`;
    const flexible: any = await client.fetch(flexibleQuery, { slug });

    if (flexible) {
      const imageSrc = flexible?.hero?.backgroundImage
        ? urlFor(flexible.hero.backgroundImage).width(1200).url()
        : '/placeholder.png';
      return {
        props: {
          title: flexible?.title ?? null,
          imageSrc,
          imageAlt: flexible?.hero?.imageAlt || flexible?.title || 'Page image',
          content: [],
          hero: {
            eyebrow: flexible.hero?.eyebrow ?? null,
            title: flexible.hero?.title ?? null,
            subtitle: flexible.hero?.subtitle ?? null,
            backgroundImage: flexible.hero?.backgroundImage
              ? urlFor(flexible.hero.backgroundImage).width(1200).url()
              : null,
            imageAlt: flexible.hero?.imageAlt ?? null,
            ctas: flexible.hero?.ctas || [],
          },
          sections: flexible.sections || [],
        },
        revalidate: 60,
      };
    }
    // Generic fallback: try any document types that use a `slug`.
    // Add types here as you create them.
    const typesWithSlug = ['learnMore', 'project'];
    const docQuery = `*[_type in $types && slug.current == $slug][0]{_type, title, slug, image, imageAlt, content, ctas, description, coverImage, subtitle}`;
    const doc: any = await client.fetch(docQuery, { types: typesWithSlug, slug });

    if (!doc) return { notFound: true };

    // Map discovered document types into props that `LearnMorePage` understands.
    if (doc._type === 'learnMore') {
      const imageSrc = doc?.image ? urlFor(doc.image).width(1200).url() : '/placeholder.png';
      const imageAlt = doc?.imageAlt || doc?.title || 'Page image';
      return {
        props: {
          title: doc?.title ?? null,
          imageSrc,
          imageAlt,
          content: doc?.content || [],
        },
        revalidate: 60,
      };
    }

    if (doc._type === 'project') {
      const imageSrc = doc?.coverImage
        ? urlFor(doc.coverImage).width(1200).url()
        : '/placeholder.png';
      const imageAlt = doc?.subtitle || doc?.title || 'Project image';
      // Convert simple text description into a minimal Portable Text block if necessary
      const content = doc?.description
        ? [
            {
              _type: 'block',
              children: [{ _type: 'span', text: String(doc.description) }],
            },
          ]
        : [];
      return {
        props: {
          title: doc?.title ?? null,
          imageSrc,
          imageAlt,
          content,
        },
        revalidate: 60,
      };
    }

    // Unknown doc type — return notFound to let Next.js handle 404
    return { notFound: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching page by slug:', err);
    return { notFound: true };
  }
};

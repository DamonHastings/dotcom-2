import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import LearnMorePage from '../components/LearnMorePage';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/lib/sanity';

type Props = {
  title?: string | null;
  imageSrc: string;
  imageAlt?: string;
  content?: unknown[];
  hero?: unknown;
  sections?: unknown[];
};

type Section = { _type?: string; [key: string]: unknown };

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
          sections={sections as unknown as Section[]}
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
    const coerceString = (v: unknown): string | null => (typeof v === 'string' ? v : null);
    // Prefer flexible pages
    const flexibleQuery = `*[_type == "flexiblePage" && slug.current == $slug][0]{title, slug, hero, sections}`;
    const flexible = (await client.fetch(flexibleQuery, { slug })) as unknown;

    if (flexible) {
      const flexibleObj = flexible as unknown as {
        hero?: Record<string, unknown>;
        title?: string;
        sections?: unknown[];
      };
      const imageSrc = flexibleObj?.hero?.backgroundImage
        ? urlFor(flexibleObj.hero.backgroundImage as Record<string, unknown>)
            .width(1200)
            .url()
        : '/placeholder.png';
      const imageAltStr = (() => {
        const heroImgAlt = (flexibleObj.hero as Record<string, unknown> | undefined)?.imageAlt;
        if (typeof heroImgAlt === 'string') return heroImgAlt;
        if (typeof flexibleObj?.title === 'string') return flexibleObj.title;
        return 'Page image';
      })();

      return {
        props: {
          title: coerceString(flexibleObj?.title),
          imageSrc,
          imageAlt: imageAltStr,
          content: [],
          hero: {
            eyebrow: coerceString(
              (flexibleObj.hero as Record<string, unknown> | undefined)?.eyebrow
            ),
            title: coerceString((flexibleObj.hero as Record<string, unknown> | undefined)?.title),
            subtitle: coerceString(
              (flexibleObj.hero as Record<string, unknown> | undefined)?.subtitle
            ),
            backgroundImage: (flexibleObj.hero as Record<string, unknown> | undefined)
              ?.backgroundImage
              ? urlFor(
                  (flexibleObj.hero as Record<string, unknown>).backgroundImage as Record<
                    string,
                    unknown
                  >
                )
                  .width(1200)
                  .url()
              : null,
            imageAlt: coerceString(
              (flexibleObj.hero as Record<string, unknown> | undefined)?.imageAlt
            ),
            ctas: (flexibleObj.hero as Record<string, unknown> | undefined)?.ctas || [],
          },
          sections: flexibleObj.sections || [],
        },
        revalidate: 60,
      };
    }
    // Generic fallback: try any document types that use a `slug`.
    // Add types here as you create them.
    const typesWithSlug = ['learnMore', 'project'];
    const docQuery = `*[_type in $types && slug.current == $slug][0]{_type, title, slug, image, imageAlt, content, ctas, description, coverImage, subtitle}`;
    const doc = (await client.fetch(docQuery, { types: typesWithSlug, slug })) as unknown;

    if (!doc) return { notFound: true };

    // Map discovered document types into props that `LearnMorePage` understands.
    const docAny = doc as unknown as Record<string, unknown>;
    if (docAny._type === 'learnMore') {
      const imageSrc = docAny?.image ? urlFor(docAny.image).width(1200).url() : '/placeholder.png';
      const imageAlt = (() => {
        const imgAlt = docAny?.imageAlt as unknown;
        if (typeof imgAlt === 'string') return imgAlt;
        const title = docAny?.title as unknown;
        if (typeof title === 'string') return title;
        return 'Page image';
      })();
      return {
        props: {
          title: coerceString(docAny?.title),
          imageSrc,
          imageAlt,
          content: (docAny?.content as unknown[]) || [],
        },
        revalidate: 60,
      };
    }

    if (docAny._type === 'project') {
      const imageSrc = docAny?.coverImage
        ? urlFor(docAny.coverImage).width(1200).url()
        : '/placeholder.png';
      const imageAlt = (() => {
        const subtitle = docAny?.subtitle as unknown;
        if (typeof subtitle === 'string') return subtitle;
        const title = docAny?.title as unknown;
        if (typeof title === 'string') return title;
        return 'Project image';
      })();
      // Convert simple text description into a minimal Portable Text block if necessary
      const content = docAny?.description
        ? [
            {
              _type: 'block',
              children: [{ _type: 'span', text: String(docAny.description) }],
            },
          ]
        : [];
      return {
        props: {
          title: coerceString(docAny?.title),
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

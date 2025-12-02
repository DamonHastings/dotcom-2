import React from 'react';
import { GetStaticProps } from 'next';
import LearnMorePage from '../components/LearnMorePage';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/lib/sanity';

type Props = {
  imageSrc: string;
  imageAlt?: string;
  content?: unknown[];
  title?: string | null;
  hero?: unknown;
  sections?: unknown[];
};

type Section = { _type?: string; [key: string]: unknown };

const LearnMore = ({ imageSrc, imageAlt, content, title, hero, sections }: Props) => {
  // Debug: log server-side fetch result (kept outside JSX)
  // eslint-disable-next-line no-console
  console.log('LearnMore page content:', content);

  return (
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
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const coerceString = (v: unknown): string | null => (typeof v === 'string' ? v : null);
    // Try to fetch a flexiblePage with slug "learn-more" first
    const flexibleQuery = `*[_type == "flexiblePage" && slug.current == "learn-more"][0]{title, slug, hero, sections}`;
    const flexible = (await client.fetch(flexibleQuery)) as unknown;

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
        return 'Learn more image';
      })();

      return {
        props: {
          title: coerceString(flexibleObj?.title),
          imageSrc,
          imageAlt: imageAltStr,
          content: [],
          // pass flexible fields for the component to render
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

    // Fallback to legacy learnMore document
    const query = `*[_type == "learnMore"][0]{title, image, imageAlt, content}`;
    const data = (await client.fetch(query)) as unknown;
    const dataObj = data as unknown as Record<string, unknown>;

    const imageSrc = (dataObj?.image as Record<string, unknown> | undefined)
      ? urlFor(dataObj.image as Record<string, unknown>)
          .width(1200)
          .url()
      : '/placeholder.png';
    const imageAlt =
      (dataObj?.imageAlt as string | undefined) ||
      (dataObj?.title as string | undefined) ||
      'Learn more image';

    return {
      props: {
        title: (dataObj?.title as string | null) ?? null,
        imageSrc,
        imageAlt,
        content: (dataObj?.content as unknown[] | undefined) || [],
      },
      revalidate: 60,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching learnMore:', err);
    return {
      props: {
        title: null,
        imageSrc: '/placeholder.png',
        imageAlt: 'Learn more image',
        content: [],
      },
    };
  }
};

export default LearnMore;

import React from 'react';
import { GetStaticProps } from 'next';
import LearnMorePage from '../components/LearnMorePage';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/lib/sanity';

type Props = {
  imageSrc: string;
  imageAlt?: string;
  content?: any[];
  title?: string | null;
  hero?: any;
  sections?: any[];
};

const LearnMore = ({ imageSrc, imageAlt, content, title, hero, sections }: Props) => {
  return (
    <main>
      {console.log('LearnMore page content:', content)}
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
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    // Try to fetch a flexiblePage with slug "learn-more" first
    const flexibleQuery = `*[_type == "flexiblePage" && slug.current == "learn-more"][0]{title, slug, hero, sections}`;
    const flexible: any = await client.fetch(flexibleQuery);

    if (flexible) {
      const imageSrc = flexible?.hero?.backgroundImage
        ? urlFor(flexible.hero.backgroundImage).width(1200).url()
        : '/placeholder.png';
      return {
        props: {
          title: flexible?.title ?? null,
          imageSrc,
          imageAlt: flexible?.hero?.imageAlt || flexible?.title || 'Learn more image',
          content: [],
          // pass flexible fields for the component to render
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

    // Fallback to legacy learnMore document
    const query = `*[_type == "learnMore"][0]{title, image, imageAlt, content}`;
    const data: any = await client.fetch(query);

    const imageSrc = data?.image ? urlFor(data.image).width(1200).url() : '/placeholder.png';
    const imageAlt = data?.imageAlt || data?.title || 'Learn more image';

    return {
      props: {
        title: data?.title ?? null,
        imageSrc,
        imageAlt,
        content: data?.content || [],
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

import React from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import ptComponents from '@/lib/portableTextComponents';
import HeroSection from '@/components/sections/HeroSection';
import RichTextSection from '@/components/sections/RichTextSection';
import TwoColumnSection from '@/components/sections/TwoColumnSection';
import CTAGroup from '@/components/ui/CTA';

type LearnMorePageProps = {
  // Backwards compatible fields
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  // Either pass a raw HTML string or Portable Text blocks.
  body?: string; // HTML string fallback
  content?: unknown[]; // Portable Text blocks
  ctas?: { label: string; href: string; variant?: 'primary' | 'secondary' | 'ghost' }[];
  // New flexible page fields
  hero?: unknown;
  sections?: Section[];
  children?: React.ReactNode;
  className?: string;
  unoptimized?: boolean;
};

type Section = {
  _type?: string;
  [key: string]: unknown;
};

type CTA = { label: string; href: string; variant?: 'primary' | 'secondary' | 'ghost' };

// Use shared `ptComponents` imported from `src/lib/portableTextComponents`

const LearnMorePage: React.FC<LearnMorePageProps> = ({
  title,
  imageSrc,
  imageAlt = 'Image',
  body = '',
  content,
  ctas,
  children,
  className,
  unoptimized = false,
  hero,
  sections,
}) => {
  // If caller provided a flexible `hero`/`sections` use those, otherwise fall back to legacy props
  const hasFlexible = !!(hero || (sections && sections.length));

  return (
    <div className={className ?? ''}>
      {hasFlexible ? (
        <>
          {hero ? (
            <HeroSection
              eyebrow={hero.eyebrow}
              title={hero.title}
              subtitle={hero.subtitle}
              backgroundImage={hero.backgroundImage}
              imageAlt={hero.imageAlt}
              ctas={hero.ctas}
              unoptimized={unoptimized}
            />
          ) : null}

          {sections && sections.length
            ? sections.map((s: Section, i: number) => {
                if (s._type === 'richTextSection') {
                  return (
                    <RichTextSection
                      key={i}
                      heading={s.heading as string}
                      content={s.content as unknown[]}
                      ctas={s.ctas as CTA[]}
                    />
                  );
                }
                if (s._type === 'twoColumnSection') {
                  return (
                    <TwoColumnSection
                      key={i}
                      left={s.left}
                      right={s.right}
                      reverse={s.reverse as boolean}
                      ctas={s.ctas as CTA[]}
                    />
                  );
                }
                if (s._type === 'heroSection') {
                  return (
                    <HeroSection
                      key={i}
                      eyebrow={s.eyebrow as string}
                      title={s.title as string}
                      subtitle={s.subtitle as string}
                      backgroundImage={s.backgroundImage}
                      imageAlt={s.imageAlt as string}
                      ctas={s.ctas as CTA[]}
                    />
                  );
                }
                return null;
              })
            : null}
        </>
      ) : (
        <section className={`container mx-auto px-4 py-12`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="col-span-1">
              {imageSrc ? (
                <div className="w-full h-full rounded overflow-hidden shadow-sm">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={800}
                    height={800}
                    className="object-cover w-full h-full"
                    unoptimized={unoptimized}
                  />
                </div>
              ) : null}
              {ctas && ctas.length ? (
                <div className="mt-4">
                  <CTAGroup ctas={ctas} />
                </div>
              ) : null}
            </div>

            <div className="md:col-span-2 prose max-w-none">
              {title ? <h1 className="text-3xl font-extrabold mb-4">{title}</h1> : null}

              {children ? (
                children
              ) : content && content.length ? (
                <PortableText value={content} components={ptComponents as unknown} />
              ) : body ? (
                <div dangerouslySetInnerHTML={{ __html: body }} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No content yet — edit this page in the Studio.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LearnMorePage;

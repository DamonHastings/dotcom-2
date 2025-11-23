import React from 'react';
import { PortableText } from '@portabletext/react';
import ptComponents from '@/lib/portableTextComponents';
import CTAGroup from '../ui/CTA';

type RichTextSectionProps = {
  heading?: string;
  content?: any[];
  ctas?: any[];
};

const RichTextSection: React.FC<RichTextSectionProps> = ({ heading, content, ctas }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="prose max-w-none">
          {heading ? <h2 className="text-2xl font-semibold mb-4">{heading}</h2> : null}
          {content && content.length ? (
            <PortableText value={content} components={ptComponents as any} />
          ) : (
            <p className="text-sm text-muted-foreground">No content yet — edit in the Studio.</p>
          )}
          {ctas && ctas.length ? (
            <div className="mt-6">
              <CTAGroup ctas={ctas} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default RichTextSection;

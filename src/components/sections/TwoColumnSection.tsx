/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PortableText } from '@portabletext/react';
import ptComponents from '@/lib/portableTextComponents';
import CTAGroup from '../ui/CTA';

type TwoColumnSectionProps = {
  left?: unknown[];
  right?: unknown[];
  reverse?: boolean;
  ctas?: unknown[];
};

const TwoColumnSection: React.FC<TwoColumnSectionProps> = ({ left, right, reverse, ctas }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div
          className={`grid gap-8 ${
            reverse ? 'md:grid-cols-2 md:flex-row-reverse' : 'md:grid-cols-2'
          }`}
        >
          <div className="prose max-w-none">
            {left && left.length ? (
              <PortableText value={left as any} components={ptComponents as any} />
            ) : null}
          </div>
          <div className="prose max-w-none">
            {right && right.length ? (
              <PortableText value={right as any} components={ptComponents as any} />
            ) : null}
          </div>
        </div>
        {ctas && ctas.length ? (
          <div className="mt-6">
            <CTAGroup ctas={ctas as any} />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default TwoColumnSection;

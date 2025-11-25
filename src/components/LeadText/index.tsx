import React from 'react';
import type { JSX } from 'react';
import { PortableText } from '@portabletext/react';
import ptComponents from '../../lib/portableTextComponents';

export interface LeadTextProps {
  heading: string | any[];
  children?: React.ReactNode | any[]; // paragraph / description (can be Portable Text)
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function LeadText({
  heading,
  children,
  className = '',
  as: HeadingTag = 'h2',
}: LeadTextProps) {
  const isHeadingPortable = Array.isArray(heading);
  const isBodyPortable = Array.isArray(children);

  // For heading we want portable text blocks to be rendered inside the heading tag.
  const headingComponents = {
    ...ptComponents,
    types: {
      // render any block as a heading element
      block: ({ children: blockChildren }: any) => (
        // Using the HeadingTag ensures correct semantics when the content is a single block
        <HeadingTag className="text-l md:text-xl font-semibold leading-snug">
          {blockChildren}
        </HeadingTag>
      ),
    },
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative max-w-xl">
        <div className="bg-orange-200 p-6 mb-6">
          {isHeadingPortable ? (
            <PortableText value={heading} components={headingComponents} />
          ) : (
            <HeadingTag className="text-l md:text-xl font-semibold leading-snug">
              {heading}
            </HeadingTag>
          )}

          {/* speech bubble tail pointing right */}
          <div
            aria-hidden="true"
            className="w-4 h-4 bg-orange-200 transform rotate-45 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
          />
        </div>
      </div>

      {isBodyPortable ? (
        <PortableText value={children as any} components={ptComponents} />
      ) : (
        children && <p className="text-md md:text-md leading-snug">{children}</p>
      )}
    </div>
  );
}

export default LeadText;

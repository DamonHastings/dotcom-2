import React from 'react';
import type { JSX } from 'react';

export interface LeadTextProps {
  heading: string;
  children?: React.ReactNode; // paragraph / description
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function LeadText({
  heading,
  children,
  className = '',
  as: HeadingTag = 'h2',
}: LeadTextProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative max-w-xl">
        <div className="bg-emerald-100 rounded-2xl p-6 shadow-lg mb-6">
          <HeadingTag className="text-2xl md:text-3xl font-semibold leading-snug">
            {heading}
          </HeadingTag>
          {/* speech bubble tail pointing right */}
          <div
            aria-hidden="true"
            className="w-4 h-4 bg-emerald-100 shadow-lg transform rotate-45 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
          />
        </div>
      </div>
      {children && <p className="text-lg md:text-lg leading-relaxed italic">{children}</p>}
    </div>
  );
}

export default LeadText;

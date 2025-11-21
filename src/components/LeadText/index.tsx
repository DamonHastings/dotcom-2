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
      <HeadingTag className="text-xl md:text-2xl font-semibold leading-snug">{heading}</HeadingTag>
      {children && <p className="text-sm md:text-base leading-relaxed">{children}</p>}
    </div>
  );
}

export default LeadText;

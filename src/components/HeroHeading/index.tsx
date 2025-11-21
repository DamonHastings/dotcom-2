import React from 'react';

export type HeroHeadingProps = {
  lines: string[]; // each array item becomes its own line
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export function HeroHeading({ lines, className = '', as: Tag = 'h1' }: HeroHeadingProps) {
  return (
    <Tag className={`font-bold tracking-tight text-3xl md:text-5xl leading-tight space-y-2 ${className}`}> 
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </Tag>
  );
}

export default HeroHeading;
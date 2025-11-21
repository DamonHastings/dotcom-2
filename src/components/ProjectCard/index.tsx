import React from 'react';
import Card from '../Card';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

type SanityImage = { _type?: 'image'; asset?: { _ref: string } };

export interface ProjectCardProps {
  title: string;
  subtitle: string; // e.g. Brand | Design
  coverImage?: SanityImage; // Sanity image field
  image?: React.ReactNode; // optional custom React node override
  className?: string;
  arrow?: boolean; // display arrow icon overlay (for 'more' card)
}

export function ProjectCard({
  title,
  subtitle,
  coverImage,
  image,
  className = '',
  arrow = false,
}: ProjectCardProps) {
  const renderedImage =
    image ||
    (coverImage ? (
      <Image
        src={urlFor(coverImage).width(800).height(800).fit('crop').quality(80).url()}
        alt={title}
        fill
        className="object-cover rounded"
        sizes="(max-width: 768px) 50vw, 280px"
        priority={false}
      />
    ) : null);

  return (
    <div className={`flex flex-col ${className}`}>
      <Card className="p-0 aspect-square flex items-center justify-center bg-pink-200 dark:bg-pink-300/20 relative overflow-hidden">
        {renderedImage}
        {arrow && (
          <span
            aria-hidden
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full border border-gray-800 dark:border-gray-200 flex items-center justify-center text-lg bg-white/70 backdrop-blur-sm"
          >
            →
          </span>
        )}
      </Card>
      <div className="mt-3">
        <div className="text-sm font-semibold leading-tight">{title}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</div>
      </div>
    </div>
  );
}

export default ProjectCard;

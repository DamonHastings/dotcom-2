import React from 'react';
import Card from '../Card';

export interface ProjectCardProps {
  title: string;
  subtitle: string; // e.g. Brand | Design
  image?: React.ReactNode; // pass <Image/> or placeholder
  className?: string;
  arrow?: boolean; // display arrow icon overlay (for 'more' card)
}

export function ProjectCard({
  title,
  subtitle,
  image,
  className = '',
  arrow = false,
}: ProjectCardProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <Card className="p-0 aspect-square flex items-center justify-center bg-pink-200 dark:bg-pink-300/20 relative">
        {image}
        {arrow && (
          <span
            aria-hidden
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full border border-gray-800 dark:border-gray-200 flex items-center justify-center text-lg"
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

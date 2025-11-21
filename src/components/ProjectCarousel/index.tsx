import React from 'react';
import { ProjectCard, ProjectCardProps } from '../ProjectCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNavButton } from '../ui/carousel';

export interface ProjectCarouselProps {
  projects: ProjectCardProps[];
  className?: string;
}

// A horizontal sliding carousel that advances one project at a time and loops infinitely.
// Uses transform translateX to move a track containing cloned first slide at the end for seamless loop.
export function ProjectCarousel({ projects, className = '' }: ProjectCarouselProps) {
  const realCount = projects.length;
  return (
    <Carousel
      className={className}
      opts={{ loop: true, align: 'start', skipSnaps: false }}
      role="region"
      aria-label="Project showcase carousel"
    >
      <CarouselContent>
        {projects.map((p, i) => (
          <CarouselItem key={i}>
            <ProjectCard {...p} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {realCount > 1 && (
        <>
          <CarouselNavButton direction="prev" />
          <CarouselNavButton direction="next" />
          <div className="absolute bottom-2 right-4 text-[11px] px-2 py-1 rounded bg-white/70 dark:bg-gray-800/70">
            {realCount.toString().padStart(2, '0')} projects
          </div>
        </>
      )}
    </Carousel>
  );
}

export default ProjectCarousel;

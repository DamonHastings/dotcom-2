import React, { useEffect, useRef, useState } from 'react';
import { ProjectCard, ProjectCardProps } from '../ProjectCard';

export interface ProjectCarouselProps {
  projects: ProjectCardProps[];
  intervalMs?: number; // time between automatic advances
  pauseOnHover?: boolean;
  className?: string;
}

// A horizontal sliding carousel that advances one project at a time and loops infinitely.
// Uses transform translateX to move a track containing cloned first slide at the end for seamless loop.
export function ProjectCarousel({
  projects,
  intervalMs = 4000,
  pauseOnHover = true,
  className = '',
}: ProjectCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto advance
  useEffect(() => {
    if (isPaused || projects.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => i + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, isPaused, projects.length]);

  // Handle infinite loop by resetting index after transition when at cloned slide
  useEffect(() => {
    if (projects.length === 0) return;
    const realCount = projects.length;
    if (index === realCount) {
      // after animation finishes, jump back to 0 without animation
      const timeout = setTimeout(() => {
        if (!trackRef.current) return;
        trackRef.current.style.transition = 'none';
        setIndex(0);
        // force reflow then restore transition
        void trackRef.current.offsetWidth;
        trackRef.current.style.transition = 'transform 600ms cubic-bezier(0.4,0.1,0.2,1)';
      }, 610);
      return () => clearTimeout(timeout);
    }
  }, [index, projects.length]);

  const realCount = projects.length;
  const displayed = realCount > 0 ? [...projects, projects[0]] : [];
  const slideWidth = 280; // px basis for card width + gap (approx)
  const translateX = -index * slideWidth;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      role="region"
      aria-label="Project showcase carousel"
    >
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 will-change-transform"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: 'transform 600ms cubic-bezier(0.4,0.1,0.2,1)',
            width: displayed.length * slideWidth,
          }}
        >
          {displayed.map((p, i) => (
            <div key={i} style={{ flex: `0 0 ${slideWidth - 32}px` }}>
              <ProjectCard {...p} />
            </div>
          ))}
        </div>
      </div>
      {/* Controls */}
      {realCount > 1 && (
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => setIndex((i) => (i <= 0 ? realCount - 1 : i - 1))}
            className="px-3 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Prev
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => setIndex((i) => i + 1)}
            className="px-3 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Next
          </button>
          <button
            type="button"
            aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            onClick={() => setPaused((p) => !p)}
            className="px-3 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isPaused ? 'Play' : 'Pause'}
          </button>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {((index % realCount) + 1).toString().padStart(2, '0')} / {realCount
              .toString()
              .padStart(2, '0')}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectCarousel;

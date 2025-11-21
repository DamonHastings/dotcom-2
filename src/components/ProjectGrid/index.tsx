import React from 'react';
import { ProjectCard, ProjectCardProps } from '../ProjectCard';

export interface ProjectGridProps {
  projects: ProjectCardProps[];
  className?: string;
  columns?: number; // default responsive handling
}

export function ProjectGrid({ projects, className = '', columns = 4 }: ProjectGridProps) {
  const colClass = columns === 4 ? 'grid-cols-2 md:grid-cols-4' : `grid-cols-${columns}`;
  return (
    <div className={`grid gap-8 ${colClass} ${className}`}> 
      {projects.map((p, i) => (
        <ProjectCard key={i} {...p} />
      ))}
    </div>
  );
}

export default ProjectGrid;
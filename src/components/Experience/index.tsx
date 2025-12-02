import React from 'react';
import type { TimelineEntry } from '@/components/SkillTimeline';
import ExperienceList from '@/components/ExperienceList';
import type { Experience } from '@/lib/sanity';

interface Props {
  experiences: Experience[];
  /** Optional mapping from experience _id to timeline entries */
  timelinesById?: Record<string, TimelineEntry[]>;
  /** fallback timeline when no per-experience timeline is available */
  timeline?: TimelineEntry[];
}

export default function Experience({ experiences, timelinesById, timeline }: Props) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectedExperience = experiences[selectedIndex];
  const selectedTimeline =
    (selectedExperience && timelinesById && timelinesById[selectedExperience._id]) ||
    timeline ||
    [];

  return (
    <section className="max-w-6xl mx-auto mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Experience</h2>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 md:col-span-4">
          {selectedTimeline && selectedTimeline.length ? (
            // <Timeline entries={selectedTimeline} />
            <></>
          ) : (
            <div className="p-4 bg-gray-50 rounded">
              No timeline data provided for this experience.
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-8">
          <ExperienceList
            experiences={experiences}
            timeline={timeline ?? []}
            selectedIndex={selectedIndex}
            onSelectedIndexChange={(i) => setSelectedIndex(i)}
          />
        </div>
      </div>
    </section>
  );
}

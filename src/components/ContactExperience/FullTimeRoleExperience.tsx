import React, { useState } from 'react';
import type { FullTimeRoleExperienceProps, SchedulePayload } from './types';
import MeetingScheduler from './MeetingScheduler';

export default function FullTimeRoleExperience({
  resumeUrl,
  onMessage,
  onSchedule,
}: FullTimeRoleExperienceProps) {
  const [showScheduler, setShowScheduler] = useState(false);

  const sampleSlots = [
    // sample future ISO slots — replace these with real availability from calendar integration
    new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
  ];

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <h3 className="text-xl font-bold mb-3">Full Time Role</h3>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onMessage?.()}
          className="px-3 py-2 bg-white border rounded-md shadow-sm"
        >
          Send a message
        </button>

        <a
          href={resumeUrl ?? '/resume.pdf'}
          download
          className="px-3 py-2 bg-white border rounded-md shadow-sm text-center"
        >
          Download resume
        </a>

        <button
          onClick={() => setShowScheduler((s) => !s)}
          className="px-3 py-2 bg-emerald-500 text-white rounded-md shadow-sm"
        >
          Schedule time
        </button>
      </div>

      {showScheduler && (
        <div className="mt-4">
          <MeetingScheduler
            initialPurpose="Discuss full-time role"
            availableSlots={sampleSlots}
            onCancel={() => setShowScheduler(false)}
            onSchedule={(payload: SchedulePayload) => {
              setShowScheduler(false);
              // bubble up so parent can perform actual calendar booking
              onSchedule?.(payload);
              // simple UX: show a quick ack (could be replaced by a toast)
              // eslint-disable-next-line no-alert
              alert(`Scheduled: ${payload.slot} — ${payload.purpose}`);
            }}
          />
        </div>
      )}
    </div>
  );
}

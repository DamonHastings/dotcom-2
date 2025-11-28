import React, { useMemo, useState } from 'react';
import type { MeetingSchedulerProps, SchedulePayload } from './types';
import TimeSelector from './TimeSelector';

export default function MeetingScheduler({
  initialPurpose = '',
  availableSlots = [],
  onSchedule,
  onCancel,
}: MeetingSchedulerProps) {
  const [purpose, setPurpose] = useState(initialPurpose);
  const [details, setDetails] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(30);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(availableSlots?.[0] ?? null);

  const friendlySlots = useMemo(() => {
    // if slots are ISO strings try to show friendly dates; fall back to raw strings
    return availableSlots;
  }, [availableSlots]);

  return (
    <div className="border p-4 rounded-md bg-white shadow-sm">
      <h3 className="text-lg font-bold mb-3">Schedule a meeting</h3>

      <label className="text-sm block mb-2">
        Purpose
        <input
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="What would you like to discuss?"
          className="mt-1 block w-full rounded-md border px-2 py-1"
        />
      </label>

      <label className="text-sm block mb-2">
        Details (optional)
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Any context or links that would help prepare"
          className="mt-1 block w-full rounded-md border px-2 py-1"
        />
      </label>

      <label className="text-sm block mb-3">
        Duration
        <select
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
          className="mt-1 block rounded-md border px-2 py-1"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>60 minutes</option>
        </select>
      </label>

      <div className="mb-3">
        <div className="text-sm font-medium mb-2">Choose a time</div>
        <TimeSelector
          availableSlots={friendlySlots}
          selected={selectedSlot}
          onSelect={(s) => setSelectedSlot(s)}
        />
      </div>

      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button onClick={onCancel} className="px-3 py-1 rounded-md bg-gray-100">
            Cancel
          </button>
        )}
        <button
          onClick={() => {
            if (!selectedSlot) return;
            const payload: SchedulePayload = {
              purpose,
              details: details || undefined,
              durationMinutes: durationMinutes ?? undefined,
              slot: selectedSlot,
            };
            onSchedule(payload);
          }}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

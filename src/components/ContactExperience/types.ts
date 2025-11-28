export type SchedulePayload = {
  purpose: string;
  details?: string;
  durationMinutes?: number;
  slot: string; // ISO string or opaque id for the chosen slot
};

export type MeetingSchedulerProps = {
  initialPurpose?: string;
  availableSlots?: string[]; // array of ISO datetimes or friendly strings
  onSchedule: (payload: SchedulePayload) => void;
  onCancel?: () => void;
};

export type FullTimeRoleExperienceProps = {
  resumeUrl?: string;
  onMessage?: () => void; // open messaging flow
  onSchedule?: (payload: SchedulePayload) => void;
};

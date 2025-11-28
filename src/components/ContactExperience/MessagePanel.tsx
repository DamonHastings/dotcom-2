import React, { useState } from 'react';
import type { SchedulePayload } from './types';
import { IconGrid, IconDownload, IconEnvelope } from '../icons';
import IconButton from '../Button/CircleIconButton';

type Props = {
  title?: string;
  /** options for the topic selector shown as the subtitle */
  subtitleOptions?: string[];
  /** initial selected subtitle/topic */
  initialSubtitle?: string;
  resumeUrl?: string;
  emailLabel?: string;
  profileLabel?: string;
  onSend?: (message: { text: string; includeResume?: boolean; contactByEmail?: boolean }) => void;
  onSchedule?: (payload: SchedulePayload) => void;
};

export default function MessagePanel({
  title = "Let's discuss:",
  subtitleOptions = ['Full-Time Roles', 'Contracting Opportunities', 'Project Ideas', 'Other'],
  initialSubtitle,
  resumeUrl = '/resume.pdf',
  emailLabel = 'Email in profile',
  profileLabel = 'Profile',
  onSend,
  onSchedule,
}: Props) {
  const [text, setText] = useState('');
  const [includeResume, setIncludeResume] = useState(true);
  const [contactByEmail, setContactByEmail] = useState(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState(initialSubtitle ?? subtitleOptions[0]);

  return (
    <div className="border rounded-md bg-white shadow-sm p-4 max-w-xl">
      <div className="grid grid-cols-8 md:grid-cols-8 gap-20">
        <div className="col-span-4 span md:col-span-5 mb-2">
          <div>
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="text-xl font-bold">
              <label htmlFor="topic-select" className="sr-only">
                Topic
              </label>
              <select
                id="topic-select"
                value={selectedSubtitle}
                onChange={(e) => setSelectedSubtitle(e.target.value)}
                className="text-xl font-bold bg-transparent p-0 border-b-2 border-b-gray-200 focus:ring-0"
              >
                {subtitleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2">
              <div className="text-sm text-muted-foreground mb-1">Message</div>
              <label className="sr-only" htmlFor="message-textarea">
                Message
              </label>
              <textarea
                id="message-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[120px] rounded-md border px-3 py-2"
              />
            </div>
          </div>
        </div>
        <div className="col-span-4 md:col-span-3">
          <div className="flex align-center">
            <span className="font-medium">Download resume</span>
            <IconButton
              as="button"
              onClick={() => {}}
              aria-label="Download resume"
              title="Download resume"
              className="mb-2 ml-2"
            >
              <IconDownload className="w-5 h-5" />
            </IconButton>
          </div>
          <div className="flex align-center">
            <h3 className="text-sm">damonjhastings@gmail.com</h3>
            <IconButton
              className="ml-2"
              as="a"
              href="/contact"
              aria-label={emailLabel}
              title={emailLabel}
            >
              <IconEnvelope className="w-5 h-5" />
              <span className="sr-only">{emailLabel}</span>
            </IconButton>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeResume}
              onChange={(e) => setIncludeResume(e.target.checked)}
            />
            <span className="text-sm">Include resume</span>
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={contactByEmail}
              onChange={(e) => setContactByEmail(e.target.checked)}
            />
            <span className="text-sm">Contact via email</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onSchedule) {
                // open simple schedule flow with a tiny sample payload
                onSchedule({
                  purpose: `Discussion: ${selectedSubtitle}`,
                  slot: new Date().toISOString(),
                });
              }
            }}
            className="px-3 py-1 rounded-md bg-white border"
          >
            Schedule
          </button>

          <button
            onClick={() => onSend?.({ text, includeResume, contactByEmail })}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

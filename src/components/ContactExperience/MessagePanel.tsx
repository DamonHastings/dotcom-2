import React, { useState } from 'react';
import type { SchedulePayload } from './types';
// icons and icon button were unused in this component

type Props = {
  title?: string;
  /** options for the topic selector shown as the subtitle */
  subtitleOptions?: string[];
  /** initial selected subtitle/topic */
  initialSubtitle?: string;
  onSend?: (message: {
    name: string;
    email: string;
    message: string;
    subject?: string;
    includeResume?: boolean;
    contactByEmail?: boolean;
  }) => void;
  onSchedule?: (payload: SchedulePayload) => void;
  onCancel?: () => void;
  /** label for the send button (keeps existing callers working) */
  emailLabel?: string;
};

export default function MessagePanel({
  title = "Let's discuss:",
  subtitleOptions = ['Full-Time Roles', 'Contracting Opportunities', 'Project Ideas', 'Other'],
  initialSubtitle,
  onSend,
  onCancel,
  emailLabel,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [includeResume] = useState(true);
  const [contactByEmail] = useState(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState(initialSubtitle ?? subtitleOptions[0]);

  // Update selected subtitle when the parent changes `initialSubtitle`.
  // This allows opening the dialog with a pre-selected topic after mount.
  React.useEffect(() => {
    if (initialSubtitle) {
      // only accept the incoming subtitle if it matches one of the options
      if (subtitleOptions && subtitleOptions.includes(initialSubtitle)) {
        setSelectedSubtitle(initialSubtitle);
      } else {
        setSelectedSubtitle(subtitleOptions[0]);
      }
    } else {
      setSelectedSubtitle(subtitleOptions[0]);
    }
  }, [initialSubtitle, subtitleOptions]);

  return (
    <div className="rounded-md bg-white shadow-sm max-w-xl">
      <div className="grid grid-cols-5 md:grid-cols-4 gap-20">
        <div className="span col-span-5 md:col-span-5 mb-2">
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
              <div className="flex-col space-y-4 mb-4">
                <div>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-md border px-3 py-2 mt-3"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      className="w-full rounded-md border px-3 py-2"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-1">Message</div>
              <label className="sr-only" htmlFor="message-textarea">
                Message
              </label>
              <textarea
                id="message-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[120px] rounded-md border px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCancel?.()}
            className="px-4 py-2 border border-gray-300 text-black rounded-md font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSend?.({
                subject: selectedSubtitle,
                name,
                email,
                message,
                includeResume,
                contactByEmail,
              })
            }
            className="px-4 py-2 bg-emerald-500 text-white rounded-md font-semibold"
          >
            {emailLabel ?? 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

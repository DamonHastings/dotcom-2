import React from 'react';
import NextLink from 'next/link';
import { IconDuplicate, IconEnvelope, IconFileLines, IconOffice } from '@/components/icons';
import { MessagePanel } from '@/components/ContactExperience';

type Props = {
  contactEmail?: string;
  resumeUrl?: string;
};

export default function ContactSection({ contactEmail, resumeUrl }: Props) {
  const [currentPath, setCurrentPath] = React.useState<string | null>(null);
  const [modalTopic, setModalTopic] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    if (typeof window !== 'undefined') setCurrentPath(window.location.pathname);
  }, []);

  React.useEffect(() => {
    // expose a global helper so other components (like CurrentGoals) can open
    // the contact dialog with a pre-selected topic.
    if (typeof window !== 'undefined') {
      (window as any).openContactModalWithTopic = (topic?: string) => {
        setModalTopic(topic);
        const dlg = document.getElementById('contactModal') as HTMLDialogElement | null;
        if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
      };
    }

    return () => {
      if (typeof window !== 'undefined') delete (window as any).openContactModalWithTopic;
    };
  }, []);

  /**
   * Wrapper Link: renders a non-interactive element when href === currentPath.
   */
  const Link = ({ href, className, children, ...rest }: any) => {
    const hrefStr = typeof href === 'string' ? href : href?.pathname ?? '';
    const isCurrent = currentPath && hrefStr === currentPath;

    if (isCurrent) {
      return (
        <div
          className={`${className ?? ''} pointer-events-none opacity-60`}
          aria-current="page"
          aria-disabled="true"
          role="link"
          {...rest}
        >
          {children}
        </div>
      );
    }

    return (
      <NextLink href={href} className={className} {...rest}>
        {children}
      </NextLink>
    );
  };
  return (
    <div className="flex flex-col">
      <Link href="/work-history" className="inline-block mb-3 text-sm">
        <div className="flex items-center space-x-2 text-indigo-600 hover:underline">
          <IconOffice />
          <span className="font-medium">View Work History</span>
        </div>
      </Link>
      {resumeUrl ? (
        <Link
          href={resumeUrl}
          download
          className="inline-block mb-3 text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center space-x-2 text-indigo-600 hover:underline">
            <IconFileLines />
            <span className="font-medium">Download Resume</span>
          </div>
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => {
          setModalTopic(undefined);
          (document.getElementById('contactModal') as HTMLDialogElement | null)?.showModal();
        }}
        className="inline-block mb-3 text-sm"
      >
        <div className="flex items-center space-x-2 text-indigo-600 hover:underline">
          <IconEnvelope />
          <span className="font-medium">Send a Message</span>
        </div>
      </button>

      <dialog
        id="contactModal"
        className="rounded-md p-6 w-full max-w-lg bg-white text-black"
        aria-label="Contact form"
      >
        <MessagePanel
          title="Let's Connect about a:"
          subtitleOptions={[
            'Role Opportunity',
            'Contracting Opportunity',
            'Project Idea',
            'General Inquiry',
          ]}
          initialSubtitle={modalTopic}
          emailLabel="Send a message"
          onCancel={() =>
            (document.getElementById('contactModal') as HTMLDialogElement | null)?.close()
          }
          onSend={async (payload: any) => {
            try {
              const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              if (res.ok) {
                (document.getElementById('contactModal') as HTMLDialogElement | null)?.close();
              } else {
                console.error('Contact API error', await res.text());
                alert('Failed to send message. Please try again later.');
              }
            } catch (err) {
              console.error('Contact send failed', err);
              alert('Failed to send message. Please try again later.');
            }
          }}
        />
      </dialog>
      {contactEmail && (
        <button
          type="button"
          onClick={async () => {
            try {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(contactEmail);
              } else {
                const el = document.createElement('textarea');
                el.value = contactEmail;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
              }
            } catch (err) {
              console.error('Copy failed', err);
            }
          }}
          className="inline-block mb-3"
        >
          <div className="flex items-center space-x-2 text-indigo-600 hover:underline text-sm">
            <IconDuplicate />
            <span className="font-medium">Copy Email Address</span>
          </div>
        </button>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { type Experience } from '@/lib/sanity';
import { ArrowLink } from '@/components/ArrowLink';

interface Props {
  experiences: Experience[];
}

type Tab = 'story' | 'highlights';

const ptComponents: any = {
  types: {
    // render normal blocks (paragraphs). If children render empty for some reason,
    // fall back to concatenating the raw `value.children[].text` from the block.
    block: ({ children, value }: any) => {
      // Count React children — if none, try to extract raw text from the block value
      const hasChildren = React.Children.count(children) > 0;
      if (hasChildren) return <p className="text-sm leading-relaxed mb-3 last:mb-0">{children}</p>;

      const rawText = (value?.children || [])
        .map((c: any) => c?.text ?? '')
        .filter(Boolean)
        .join(' ');
      return <p className="text-sm leading-relaxed mb-3 last:mb-0">{rawText}</p>;
    },
  },
  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ children, value }: any) => (
      <a href={value?.href} className="text-sky-600 hover:underline">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside">{children}</ol>,
  },
};

export default function ExperienceList({ experiences }: Props) {
  if (!experiences || experiences.length === 0) return null;

  // Per-experience override tabs keyed by _id
  const [overrides, setOverrides] = useState<Record<string, Tab>>({});

  const toggleFor = (id: string, next: Tab) => {
    setOverrides((s) => ({ ...s, [id]: next }));
  };

  // When rendering, use per-item override if present, otherwise top-level default
  const getTabFor = (id: string) => overrides[id] ?? 'story';

  const first = experiences[0];

  return (
    <section className="max-w-6xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Most Recent Experience</h2>
        <ArrowLink
          href="/experiences"
          className="text-sm font-medium"
          aria-label="View all experiences"
        >
          View All Experiences
        </ArrowLink>
      </div>

      <div className="bg-transparent">
        <article className="relative grid gap-6 md:grid-cols-2 md:items-start">
          <div className="pr-6">
            <div className="mb-4 relative">
              {first.duration ? (
                <div className="absolute top-0 right-0 mt-4 mr-4">
                  <div
                    className="bg-emerald-100 rounded-lg px-4 py-3 shadow-md text-right flex flex-col items-end"
                    aria-hidden="true"
                    style={{ minWidth: 96 }}
                  >
                    <span className="text-xs uppercase tracking-wider opacity-90">Duration</span>
                    <span className="text-lg font-bold leading-tight">{first.duration}</span>
                  </div>
                </div>
              ) : null}
              <h3 className="text-lg md:text-2xl font-extrabold leading-tight">{first.company}</h3>
              {first.role ? (
                <p className="text-sm md:text-base text-muted-foreground mt-1">{first.role}</p>
              ) : null}
              <p className="text-xs text-muted-foreground mt-1">
                {first.startDate} — {first.endDate}
              </p>
            </div>

            {first.technologies && first.technologies.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {first.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs border-gray-100 dark:border-gray-800 text-muted-foreground px-3 py-0.5 rounded-full border border-transparent"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            {/* Render based on selected tab (per-item only). */}
            {getTabFor(first._id) === 'story' ? (
              // Story: render portable text (rich renderer)
              first.story && first.story.length ? (
                <div className="prose max-w-none text-base dark:prose-invert">
                  <PortableText value={first.story} components={ptComponents} />
                </div>
              ) : first.summary ? (
                <p className="text-base leading-relaxed">{first.summary}</p>
              ) : null
            ) : (
              // Resume: use ONLY resume.shortSummary and resume.bullets (no fallbacks)
              <div>
                {first.resume?.shortSummary && (
                  <p className="text-base leading-relaxed mb-2">{first.resume.shortSummary}</p>
                )}
                {first.resume?.bullets && first.resume.bullets.length ? (
                  <ul className="mt-3 list-disc list-inside">
                    {first.resume.bullets.map((b, i) => (
                      <li key={i} className="text-sm mb-3">
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
            <div className="flex items-center justify-self-end gap-3 mb-3 mt-6">
              <div className="text-sm font-medium">View:</div>
              <div className="flex rounded-md overflow-hidden">
                <button
                  onClick={() => toggleFor(first._id, 'story')}
                  className={`px-3 py-1 text-sm font-bold rounded-md ${
                    getTabFor(first._id) === 'story' ? 'bg-orange-200' : 'bg-white'
                  }`}
                >
                  Story
                </button>
                <button
                  onClick={() => toggleFor(first._id, 'highlights')}
                  className={`px-3 py-1 text-sm font-bold rounded-md ${
                    getTabFor(first._id) === 'highlights' ? 'bg-orange-200' : 'bg-white'
                  }`}
                >
                  Highlights
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

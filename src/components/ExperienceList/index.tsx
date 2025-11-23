import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { type Experience } from '@/lib/sanity';
// Note: moved the "View All" control below the component; no link import needed here
import { IconCodeBracketSquare, IconBars4 } from '@/components/icons';

interface Props {
  experiences: Experience[];
}

type Tab = 'story' | 'highlights';

import ptComponents, { blockRenderer } from '@/lib/portableTextComponents';

export default function ExperienceList({ experiences }: Props) {
  if (!experiences || experiences.length === 0) return null;

  // Global view toggle for all experience items
  const [viewTab, setViewTab] = useState<Tab>('story');

  // Display mode: 'list' shows all items, 'card' shows one item with prev/next
  const [mode, setMode] = useState<'list' | 'card'>('list');
  const [cardIndex, setCardIndex] = useState(0);

  const count = experiences.length;
  const goto = (i: number) => setCardIndex(((i % count) + count) % count);

  return (
    <section className="max-w-6xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span>Experience</span>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setMode('list')}
              aria-pressed={mode === 'list'}
              title="Show list view"
              className={`p-1 rounded-md ${mode === 'list' ? 'bg-orange-100' : 'bg-transparent'}`}
            >
              <IconBars4 className="w-5 h-5" />
              <span className="sr-only">Show list view</span>
            </button>
            <button
              onClick={() => setMode('card')}
              aria-pressed={mode === 'card'}
              title="Show card view"
              className={`p-1 rounded-md ${mode === 'card' ? 'bg-orange-100' : 'bg-transparent'}`}
            >
              <IconCodeBracketSquare className="w-5 h-5" />
              <span className="sr-only">Show card view</span>
            </button>
          </div>
        </h2>

        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">View:</div>
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setViewTab('story')}
              className={`px-3 py-1 text-sm font-bold rounded-md ${
                viewTab === 'story' ? 'bg-orange-200' : 'bg-white'
              }`}
            >
              Story
            </button>
            <button
              onClick={() => setViewTab('highlights')}
              className={`px-3 py-1 text-sm font-bold rounded-md ${
                viewTab === 'highlights' ? 'bg-orange-200' : 'bg-white'
              }`}
            >
              Highlights
            </button>
          </div>
        </div>
      </div>

      <div className="bg-transparent">
        {mode === 'list' ? (
          <div className="space-y-8">
            {experiences.map((exp) => (
              <article
                key={exp._id}
                className="relative grid gap-6 md:grid-cols-2 md:items-start mb-10"
              >
                <div className="pr-6">
                  <div className="mb-4 relative">
                    {exp.duration ? (
                      <div className="absolute top-0 right-0 mr-4">
                        <div
                          className="bg-gray-100 rounded-lg px-3 py-2 shadow-sm justify-center flex flex-col items-end"
                          aria-hidden="true"
                          style={{ minWidth: 96 }}
                        >
                          {/* <span className="text-xs uppercase tracking-wider opacity-90">
                            Duration
                          </span> */}
                          <span className="text-md font-bold leading-tight justify-center">
                            {exp.duration}
                          </span>
                        </div>
                      </div>
                    ) : null}
                    <h3 className="text-lg md:text-2xl font-extrabold leading-tight">
                      {exp.company}
                    </h3>
                    {exp.role ? (
                      <p className="text-sm md:text-base text-muted-foreground mt-1">{exp.role}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground mt-1">
                      {exp.startDate} — {exp.endDate}
                    </p>
                  </div>

                  {exp.technologies && exp.technologies.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exp.technologies.map((t, i) => (
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
                  {/* Render based on selected global tab. */}
                  {viewTab === 'story' ? (
                    // Story: render portable text (rich renderer)
                    exp.story && exp.story.length ? (
                      <div className="prose max-w-none text-base dark:prose-invert">
                        <PortableText value={exp.story} components={ptComponents} />
                      </div>
                    ) : exp.summary ? (
                      <p className="text-base leading-relaxed">{exp.summary}</p>
                    ) : null
                  ) : (
                    <div>
                      {/* Prefer `resume.shortSummary`, fall back to `summary` for a short intro */}
                      {(exp.resume?.shortSummary || exp.summary) && (
                        <p className="text-base leading-relaxed mb-2">
                          {exp.resume?.shortSummary ?? exp.summary}
                        </p>
                      )}

                      {/* Prefer `resume.bullets`, fall back to `responsibilities` which editors may have used */}
                      {(exp.resume?.bullets && exp.resume.bullets.length) ||
                      (exp.responsibilities && exp.responsibilities.length) ? (
                        <ul className="mt-3 list-disc list-inside">
                          {(exp.resume?.bullets && exp.resume.bullets.length
                            ? exp.resume.bullets
                            : exp.responsibilities || []
                          ).map((b, i) => (
                            <li key={i} className="text-sm mb-3">
                              {b}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No highlights available.</p>
                      )}
                    </div>
                  )}
                  {/* spacer to separate items visually */}
                  <div className="mb-6" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          // Card mode: show single experience with prev/next
          <div className="relative">
            {(() => {
              const exp = experiences[cardIndex];
              return (
                <article
                  key={exp._id}
                  className="relative grid gap-6 md:grid-cols-2 md:items-start bg-white py-6 rounded-lg"
                >
                  <div className="pr-6">
                    <div className="mb-4 relative">
                      {exp.duration ? (
                        <div className="absolute top-0 right-0 mt-4 mr-4">
                          <div
                            className="bg-emerald-100 rounded-lg px-4 py-3 shadow-md text-right flex flex-col items-end"
                            aria-hidden="true"
                            style={{ minWidth: 96 }}
                          >
                            <span className="text-xs uppercase tracking-wider opacity-90">
                              Duration
                            </span>
                            <span className="text-lg font-bold leading-tight">{exp.duration}</span>
                          </div>
                        </div>
                      ) : null}
                      <h3 className="text-lg md:text-2xl font-extrabold leading-tight">
                        {exp.company}
                      </h3>
                      {exp.role ? (
                        <p className="text-sm md:text-base text-muted-foreground mt-1">
                          {exp.role}
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.startDate} — {exp.endDate}
                      </p>
                    </div>

                    {exp.technologies && exp.technologies.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {exp.technologies.map((t, i) => (
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
                    {viewTab === 'story' ? (
                      exp.story && exp.story.length ? (
                        <div className="prose max-w-none text-base dark:prose-invert">
                          <PortableText value={exp.story} components={ptComponents} />
                        </div>
                      ) : exp.summary ? (
                        <p className="text-base leading-relaxed">{exp.summary}</p>
                      ) : null
                    ) : (
                      <div>
                        {(exp.resume?.shortSummary || exp.summary) && (
                          <p className="text-base leading-relaxed mb-2">
                            {exp.resume?.shortSummary ?? exp.summary}
                          </p>
                        )}
                        {(exp.resume?.bullets && exp.resume.bullets.length) ||
                        (exp.responsibilities && exp.responsibilities.length) ? (
                          <ul className="mt-3 list-disc list-inside">
                            {(exp.resume?.bullets && exp.resume.bullets.length
                              ? exp.resume.bullets
                              : exp.responsibilities || []
                            ).map((b, i) => (
                              <li key={i} className="text-sm mb-3">
                                {b}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No highlights available.</p>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })()}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {cardIndex + 1} / {count}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goto(cardIndex - 1)}
                  aria-label="Previous experience"
                  className="px-3 py-1 bg-white rounded-md shadow-sm"
                >
                  ‹
                </button>
                <button
                  onClick={() => goto(cardIndex + 1)}
                  aria-label="Next experience"
                  className="px-3 py-1 bg-white rounded-md shadow-sm"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

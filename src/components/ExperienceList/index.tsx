import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { type Experience } from '@/lib/sanity';
import type { TimelineEntry } from '@/components/SkillTimeline';
import Timeline from '@/components/Timeline';
import ptComponents from '@/lib/portableTextComponents';

interface Props {
  experiences: Experience[];
  /** optional fallback timeline entries for list-level timeline previews */
  timeline?: TimelineEntry[];
  /** Controlled selected index (optional). If provided, ExperienceList will notify via onSelectedIndexChange. */
  selectedIndex?: number;
  onSelectedIndexChange?: (i: number) => void;
}

type Tab = 'story' | 'highlights';

export default function ExperienceList(props: Props) {
  const { experiences } = props;
  // Global view toggle for all experience items
  const [viewTab, setViewTab] = useState<Tab>('highlights');

  // Display mode: 'list' shows all items, 'card' shows one item with prev/next
  const [mode, setMode] = useState<'list' | 'card'>('list');
  // internal state for card index when uncontrolled
  const [cardIndex, setCardIndexState] = useState(0);
  const cardIndexValue = props.selectedIndex ?? cardIndex;
  const setCardIndex = (i: number) => {
    if (props.onSelectedIndexChange) props.onSelectedIndexChange(i);
    setCardIndexState(i);
  };

  const count = experiences?.length ?? 0;
  const goto = (i: number) => setCardIndex(((i % count) + count) % count);
  // track which index to return to when leaving story/card view so we can scroll back
  const [returnToIndex, setReturnToIndex] = useState<number | null>(null);

  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span>Experience</span>
        </h2>

        <div className="flex items-center gap-2">
          {/* <div className="text-sm font-medium">View:</div>
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
          </div> */}
        </div>
      </div>

      <div className="bg-transparent">
        {mode === 'list' ? (
          <div className="grid grid-cols-12 gap-6">
            {experiences.map((exp, idx) => (
              <article
                id={`experience-${exp._id}`}
                key={exp._id}
                className="relative grid gap-6 md:grid-cols-12 md:items-start mb-2 col-span-12 bg-white p-10"
                onClick={() => {
                  // update internal card index and notify parent if provided
                  setCardIndex(idx);
                }}
              >
                <div className="col-span-12 md:col-span-8">
                  <div>
                    <div className="relative">
                      {exp.duration ? (
                        <div className="absolute top-0 right-0 mr-4">
                          <div
                            className="bg-gray-100 rounded-lg px-3 py-2 shadow-sm justify-center flex flex-col items-end"
                            aria-hidden="true"
                            style={{ minWidth: 96 }}
                          >
                            <span className="text-md font-bold leading-tight justify-center">
                              {exp.duration}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      <div className="mb-3">
                        <h3 className="text-lg md:text-2xl font-bold leading-tight mb-0">
                          {exp.company}
                        </h3>
                        {exp.role ? <p className="text-lg mb-0">{exp.role}</p> : null}
                        <span className="text-sm">
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
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
                  {/* spacer to separate items visually */}
                  {/* View Story button bottom-right of each experience */}
                  {exp.story ? (
                    <div className="right-0 bottom-0 mr-0 mb-0 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // remember where we came from so we can scroll back
                          setReturnToIndex(idx);
                          setCardIndex(idx);
                          setViewTab('story');
                          setMode('card');
                        }}
                        className="px-3 py-1 m-3 outline outline-1 outline-gray-300 font-semibold rounded-md shadow-sm text-sm"
                      >
                        View Story
                      </button>
                    </div>
                  ) : null}
                  <div className="mb-6" />
                </div>
                <div className="col-span-12 md:col-span-4">
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
              </article>
            ))}
          </div>
        ) : (
          // Card mode: show single experience with prev/next
          <div className="relative">
            {(() => {
              const exp = experiences[cardIndexValue];
              return (
                <article
                  key={exp._id}
                  className="relative grid md:grid-cols-12 md:items-start py-6 rounded-lg"
                >
                  <div className="md:col-span-7">
                    <div className="pr-6">
                      <div className="mb-4 relative">
                        {exp.duration ? (
                          <div className="absolute top-0 right-0 mt-4 mr-4">
                            <div
                              className="bg-white rounded-lg px-4 py-3 text-right flex flex-col items-end"
                              aria-hidden="true"
                              style={{ minWidth: 96 }}
                            >
                              <span className="text-lg font-bold leading-tight">
                                {exp.duration}
                              </span>
                            </div>
                          </div>
                        ) : null}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="flex items-center gap-4 mb-2">
                                {/* Back button next to title in card view (visible when in card mode) */}
                                {mode === 'card' && (
                                  <button
                                    onClick={() => {
                                      setMode('list');
                                      const targetIndex = returnToIndex ?? cardIndexValue;
                                      const id = experiences[targetIndex]?._id;
                                      requestAnimationFrame(() => {
                                        const el = document.getElementById(`experience-${id}`);
                                        if (el)
                                          el.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center',
                                          });
                                      });
                                    }}
                                    className="px-3 py-1 bg-white rounded-md shadow-sm text-sm"
                                  >
                                    ← Back
                                  </button>
                                )}
                              </div>

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
                          </div>

                          {/* {exp.technologies && exp.technologies.length ? (
                            <div className="hidden md:flex md:flex-wrap md:gap-2 md:items-start">
                              {exp.technologies.map((t, i) => (
                                <span
                                  key={i}
                                  className="text-xs border-gray-100 dark:border-gray-800 text-muted-foreground px-3 py-0.5 rounded-full border border-transparent"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : null} */}
                        </div>
                      </div>
                      {/* show tech chips on small screens below header */}
                      {exp.technologies && exp.technologies.length ? (
                        <div className="mt-3 mb-6 flex flex-wrap gap-2 md:hidden">
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
                  <div className="md:col-span-5 self-start">
                    <div className="">
                      <Timeline
                        experiences={[{ ...exp, technologies: exp.technologies ?? undefined }]}
                        startAtEnd
                      />
                    </div>
                  </div>
                </article>
              );
            })()}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {cardIndexValue + 1} / {count}
              </div>
              {(() => {
                const prevIndex = (((cardIndexValue - 1) % count) + count) % count;
                const nextIndex = (((cardIndexValue + 1) % count) + count) % count;
                const prevExp = experiences[prevIndex];
                const nextExp = experiences[nextIndex];
                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goto(cardIndexValue - 1)}
                      aria-label={`Previous experience: ${prevExp?.company ?? ''} — ${
                        prevExp?.role ?? ''
                      }`}
                      className="px-3 py-1 bg-white rounded-md shadow-sm"
                    >
                      ‹ {prevExp?.company} {prevExp?.role ? `— ${prevExp.role}` : ''}
                    </button>
                    <button
                      onClick={() => goto(cardIndexValue + 1)}
                      aria-label={`Next experience: ${nextExp?.company ?? ''} — ${
                        nextExp?.role ?? ''
                      }`}
                      className="px-3 py-1 bg-white rounded-md shadow-sm"
                    >
                      {nextExp?.company} {nextExp?.role ? `— ${nextExp.role}` : ''} ›
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

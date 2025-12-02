import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
// Note: react-flip-toolkit usage caused a runtime JSX parse issue in Vite; using plain mapping for now.
// If you prefer FLIP animations, we can reintroduce `react-flip-toolkit` after confirming JSX compiles.

type Experience = {
  company: string;
  role?: string | null;
  startDate?: string | null; // ISO YYYY-MM-DD or YYYY-MM
  endDate?: string | null; // null or undefined means present
  technologies?: string[];
};

type TimelineProps = {
  experiences: Experience[];
  // months per animation step in ms (smaller -> faster)
  stepMs?: number;
  // if true, position the playhead at the end of the provided timeline on mount
  startAtEnd?: boolean;
  // number of top skills to show when collapsed
  topN?: number;
};

function parseDateToMonthIndex(dateStr?: string | null) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.getFullYear() * 12 + d.getMonth();
}

function monthIndexToDate(monthIndex: number) {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  return new Date(year, month, 1);
}

export default function Timeline({
  experiences,
  stepMs = 160,
  startAtEnd = false,
  topN = 5,
}: TimelineProps) {
  // Normalize experiences
  const normalized = useMemo(() => {
    return experiences
      .map((e) => ({
        ...e,
        startMonth: parseDateToMonthIndex(e.startDate),
        endMonth: e.endDate
          ? parseDateToMonthIndex(e.endDate)
          : parseDateToMonthIndex(new Date().toISOString()),
        technologies: e.technologies ?? [],
      }))
      .sort((a, b) => a.startMonth - b.startMonth);
  }, [experiences]);

  const minMonth = normalized.length
    ? Math.min(...normalized.map((e) => e.startMonth))
    : parseDateToMonthIndex(new Date().toISOString());
  const maxMonth = normalized.length ? Math.max(...normalized.map((e) => e.endMonth)) : minMonth;

  // total career months (may be unused depending on display choices)
  // const totalCareerMonths = Math.max(1, maxMonth - minMonth);
  // all skills
  const skills = useMemo(() => {
    const set = new Set<string>();
    normalized.forEach((e) => e.technologies.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [normalized]);

  const [currentMonth, setCurrentMonth] = useState<number>(minMonth);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTickRef.current = null;
      return;
    }

    function tick(now: number) {
      if (!lastTickRef.current) lastTickRef.current = now;
      const delta = now - lastTickRef.current;
      if (delta >= stepMs) {
        setCurrentMonth((m) => {
          const next = m + 3;
          if (next > maxMonth) {
            setPlaying(false);
            return maxMonth;
          }
          return next;
        });
        lastTickRef.current = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing, stepMs, maxMonth]);

  // Optionally move the playhead to the end when requested (e.g. single-experience preview)
  useEffect(() => {
    if (startAtEnd) {
      setCurrentMonth(maxMonth);
    }
  }, [startAtEnd, maxMonth]);

  // compute cumulative months per skill up to currentMonth
  const skillMonths = useMemo(() => {
    const result: Record<string, number> = {};
    skills.forEach((s) => (result[s] = 0));

    normalized.forEach((e) => {
      const start = e.startMonth;
      const end = e.endMonth;
      // overlap with [minMonth, currentMonth]
      const clipEnd = Math.min(end, currentMonth);
      const overlap = Math.max(0, clipEnd - start);
      if (overlap <= 0) return;
      e.technologies.forEach((t) => {
        result[t] = (result[t] || 0) + overlap;
      });
    });

    return result;
  }, [normalized, skills, currentMonth]);

  // compute total possible months per skill across full career (used for grey bar max)
  const skillTotalMonths = useMemo(() => {
    const result: Record<string, number> = {};
    skills.forEach((s) => (result[s] = 0));
    normalized.forEach((e) => {
      const start = e.startMonth;
      const end = e.endMonth;
      const length = Math.max(0, end - start);
      e.technologies.forEach((t) => {
        result[t] = (result[t] || 0) + length;
      });
    });
    return result;
  }, [normalized, skills]);

  // find role at currentMonth (most recent active role)
  const currentRole = useMemo(() => {
    const active = normalized.filter(
      (e) => e.startMonth <= currentMonth && currentMonth < e.endMonth
    );
    if (active.length === 0) return null;
    active.sort((a, b) => b.startMonth - a.startMonth);
    return active[0];
  }, [normalized, currentMonth]);

  // maximum months across any skill (used for scaling when needed)
  const maxSkillMonths = Math.max(1, ...Object.values(skillTotalMonths));

  const sortedSkills = useMemo(() => {
    const currentSet = new Set<string>((currentRole?.technologies as string[] | undefined) ?? []);
    return skills
      .slice()
      .filter((s) => (skillMonths[s] || 0) > 0)
      .sort((a, b) => {
        const aIsCurrent = currentSet.has(a) ? 0 : 1;
        const bIsCurrent = currentSet.has(b) ? 0 : 1;
        if (aIsCurrent !== bIsCurrent) return aIsCurrent - bIsCurrent; // current-role skills first
        return (skillMonths[b] || 0) - (skillMonths[a] || 0);
      });
  }, [skills, skillMonths, currentRole]);

  const [showAll, setShowAll] = useState(false);
  const listWrapperRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string>('0px');

  // Adjust maxHeight to animate expand/collapse
  useLayoutEffect(() => {
    const el = listWrapperRef.current;
    if (!el) return;

    // If showing all, expand to full scrollHeight
    if (showAll) {
      const h = el.scrollHeight;
      setMaxHeight(h + 'px');
      return;
    }

    // When collapsed, compute height of first TOP_N children
    const children = Array.from(el.children) as HTMLElement[];
    let h = 0;
    for (let i = 0; i < Math.min(children.length, topN); i++) {
      h += children[i].offsetHeight;
    }
    // Ensure small non-zero height when nothing present
    setMaxHeight((h || 0) + 'px');
  }, [showAll, currentMonth, sortedSkills, topN]);

  return (
    <div className="w-full py-4 rounded-lg shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold leading-tight mb-1">
            {currentRole ? `${currentRole.role}` : 'Skills over time'}
          </h3>
          <h4 className="text-md font-semibold">{`${
            currentRole?.company ? `@ ${currentRole.company}` : ''
          }`}</h4>
          <div className="text-sm text-gray-500">
            {monthIndexToDate(currentMonth).getFullYear()}
          </div>
        </div>

        {/* Play/Pause icon button aligned to header's right */}
        <div>
          <button
            aria-pressed={playing}
            aria-label={playing ? 'Pause timeline' : 'Play timeline'}
            onClick={() => {
              if (currentMonth >= maxMonth) {
                setCurrentMonth(minMonth);
              }
              setPlaying((p) => !p);
            }}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full  border text-white hover:bg-gray-100 focus:outline-none"
          >
            {playing ? (
              // Pause icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                stroke="black"
                fill="black"
                aria-hidden
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              // Play icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                stroke="gray"
                fill="black"
              >
                <path d="M5 3v18l15-9L5 3z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {skills.length === 0 && (
          <div className="text-sm text-gray-500">No skills found in provided experiences.</div>
        )}
        <div
          ref={listWrapperRef}
          style={{ maxHeight, overflow: 'hidden', transition: 'max-height 320ms ease' }}
        >
          <div>
            {(showAll ? sortedSkills : sortedSkills.slice(0, topN)).map((s) => {
              const months = skillMonths[s] || 0;
              const years = Math.round(months / 12); // nearest whole year
              const pctCurrentOfGlobal = (months / maxSkillMonths) * 100;
              const isCurrent = !!currentRole && (currentRole.technologies || []).includes(s);
              const barColor = isCurrent ? 'bg-emerald-500' : 'bg-sky-500';
              const labelClass = isCurrent ? 'text-emerald-700 font-semibold' : 'text-gray-900';
              return (
                <div key={s} className="transition-all duration-300 mb-1">
                  <div className="flex items-center gap-4">
                    <div className={`w-40 flex-shrink-0 text-xs ${labelClass}`}>{s}</div>

                    <div className="flex-1">
                      <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
                        <div
                          style={{ width: `${pctCurrentOfGlobal}%` }}
                          className={`absolute left-0 top-0 bottom-0 ${barColor} transition-all duration-300`}
                        />
                      </div>
                    </div>

                    <div className="w-16 text-right text-sm text-gray-600">{years} yrs</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Expand/collapse toggle */}
      <div>
        {sortedSkills.length > topN && (
          <div className="mt-2 text-right">
            <button
              className="text-sm text-sky-600 hover:underline"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Show top ' + topN : `Show all (${sortedSkills.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Controls at bottom */}
      <div className="mt-4 space-y-2">
        <input
          type="range"
          min={minMonth}
          max={maxMonth}
          value={currentMonth}
          onChange={(e) => setCurrentMonth(Number(e.target.value))}
          className="w-full"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">
              {Math.round((currentMonth - minMonth) / 12)} yrs
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {monthIndexToDate(currentMonth).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

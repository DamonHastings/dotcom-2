import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
// Note: react-flip-toolkit usage caused a runtime JSX parse issue in Vite; using plain mapping for now.
// If you prefer FLIP animations, we can reintroduce `react-flip-toolkit` after confirming JSX compiles.

type Experience = {
  company: string;
  role: string;
  startDate: string; // ISO YYYY-MM-DD or YYYY-MM
  endDate?: string | null; // null or undefined means present
  technologies?: string[];
};

type TimelineProps = {
  experiences: Experience[];
  // months per animation step in ms (smaller -> faster)
  stepMs?: number;
};

function parseDateToMonthIndex(dateStr: string) {
  const d = new Date(dateStr);
  return d.getFullYear() * 12 + d.getMonth();
}

function monthIndexToDate(monthIndex: number) {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  return new Date(year, month - 1, 1);
}

export default function Timeline({ experiences, stepMs = 160 }: TimelineProps) {
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

  const totalCareerMonths = Math.max(1, maxMonth - minMonth);

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
      if (lastTickRef.current == null) lastTickRef.current = now;
      const elapsed = now - lastTickRef.current;
      if (elapsed >= stepMs) {
        setCurrentMonth((m) => {
          const next = m + 1;
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
    return skills
      .slice()
      .sort((a, b) => (skillMonths[b] || 0) - (skillMonths[a] || 0))
      .filter((s) => (skillMonths[s] || 0) > 0);
  }, [skills, skillMonths]);

  const TOP_N = 10;
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
    for (let i = 0; i < Math.min(children.length, TOP_N); i++) {
      h += children[i].offsetHeight;
    }
    // Ensure small non-zero height when nothing present
    setMaxHeight((h || 0) + 'px');
  }, [showAll, currentMonth, sortedSkills]);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div className="mb-3">
        <div>
          <h3 className="text-lg font-semibold">
            {currentRole ? `${currentRole.role} @ ${currentRole.company}` : 'Career Timeline'}
          </h3>
          <div className="text-sm text-gray-500">
            {monthIndexToDate(currentMonth).getFullYear()}
          </div>
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
            {(showAll ? sortedSkills : sortedSkills.slice(0, TOP_N)).map((s) => {
              const months = skillMonths[s] || 0;
              const years = Math.round(months / 12); // nearest whole year
              const pctCurrentOfGlobal = (months / maxSkillMonths) * 100;
              return (
                <div key={s} className="transition-all duration-300 mb-3">
                  <div className="flex justify-between mb-1">
                    <div className="text-sm font-medium">{s}</div>
                    <div className="text-sm text-gray-600">{years} yrs</div>
                  </div>
                  <div className="relative h-4 bg-gray-200 rounded overflow-hidden">
                    <div
                      style={{ width: `${pctCurrentOfGlobal}%` }}
                      className="absolute left-0 top-0 bottom-0 bg-sky-500 transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Expand/collapse toggle */}
      <div>
        {sortedSkills.length > TOP_N && (
          <div className="mt-2 text-right">
            <button
              className="text-sm text-sky-600 hover:underline"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Show top ' + TOP_N : `Show all (${sortedSkills.length})`}
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
            <button
              aria-label="play-pause"
              className="px-3 py-1 rounded bg-sky-600 text-white text-sm"
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? 'Pause' : 'Play'}
            </button>
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

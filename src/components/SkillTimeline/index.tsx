import React, { useEffect, useMemo, useState } from 'react';

export type SkillLevels = Record<string, number>; // 0-100

export type TimelineEntry = {
  year: number;
  title: string;
  skills: SkillLevels;
};

interface Props {
  timeline: TimelineEntry[];
  /** Start index into sorted timeline (defaults to last item) */
  initialIndex?: number;
}

export default function SkillTimeline({ timeline, initialIndex }: Props) {
  const sorted = useMemo(() => [...timeline].sort((a, b) => a.year - b.year), [timeline]);

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    for (const e of sorted) Object.keys(e.skills || {}).forEach((s) => set.add(s));
    return Array.from(set);
  }, [sorted]);

  const years = sorted.map((s) => s.year);
  const minYear = years[0] ?? 0;
  const maxYear = years[years.length - 1] ?? minYear;

  const defaultYear =
    typeof initialIndex === 'number' ? sorted[initialIndex]?.year ?? maxYear : maxYear;
  const [year, setYear] = useState<number>(defaultYear);

  useEffect(() => {
    setYear((y) => Math.max(minYear, Math.min(maxYear, y)));
  }, [minYear, maxYear]);

  const goPrev = () => setYear((y) => Math.max(minYear, y - 1));
  const goNext = () => setYear((y) => Math.min(maxYear, y + 1));

  function handleSliderKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Arrow keys move by 1 year, Shift+Arrow moves by 5 years.
    // PageUp/PageDown move by 5 years (Shift for 10).
    // Home/End jump to min/max.
    let handled = false;
    if (e.key === 'Home') {
      setYear(minYear);
      handled = true;
    } else if (e.key === 'End') {
      setYear(maxYear);
      handled = true;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const step = e.shiftKey ? 5 : 1;
      const delta = e.key === 'ArrowRight' ? step : -step;
      setYear((y) => {
        const next = Math.round((y + delta) * 10) / 10;
        return Math.max(minYear, Math.min(maxYear, next));
      });
      handled = true;
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
      const step = e.shiftKey ? 10 : 5;
      const delta = e.key === 'PageUp' ? step : -step;
      setYear((y) => {
        const next = Math.round((y + delta) * 10) / 10;
        return Math.max(minYear, Math.min(maxYear, next));
      });
      handled = true;
    }

    if (handled) e.preventDefault();
  }

  const entryYear = year;

  function getLevelAt(skill: string, y: number) {
    if (sorted.length === 0) return 0;
    if (y <= sorted[0].year) return sorted[0].skills[skill] ?? 0;
    if (y >= sorted[sorted.length - 1].year) return sorted[sorted.length - 1].skills[skill] ?? 0;
    let i = 0;
    while (i < sorted.length - 1 && !(sorted[i].year <= y && y <= sorted[i + 1].year)) i++;
    const a = sorted[i];
    const b = sorted[i + 1];
    const t = (y - a.year) / (b.year - a.year);
    const va = a.skills[skill] ?? 0;
    const vb = b.skills[skill] ?? 0;
    return va + (vb - va) * t;
  }

  function ratingFromPct(pct: number) {
    if (pct <= 25) return 'Beginner';
    if (pct <= 50) return 'Intermediate';
    if (pct <= 75) return 'Advanced';
    return 'Expert';
  }

  const entryTitle = (() => {
    if (sorted.length === 0) return '';
    let nearest = sorted[0];
    let bestDiff = Math.abs(sorted[0].year - entryYear);
    for (const s of sorted) {
      const d = Math.abs(s.year - entryYear);
      if (d < bestDiff) {
        bestDiff = d;
        nearest = s;
      }
    }
    return nearest.title || '';
  })();

  return (
    <section>
      <div className="grid grid-cols-12 gap-6 items-start border border-gray-100 p-8">
        <h2 className="col-span-12 text-center font-semibold text-lg">My Journey</h2>
        <div className="col-span-12 text-center">
          <div className="mb-4">
            <h3 className="text-md font-semibold">
              {' '}
              <button
                onClick={goPrev}
                aria-label="Previous year"
                className="px-2 py-1 rounded-md bg-white border shadow-sm"
                disabled={entryYear <= minYear}
              >
                ‹
              </button>
              <span className="mx-4">{entryTitle}</span>
              <button
                onClick={goNext}
                aria-label="Next year"
                className="px-2 py-1 rounded-md bg-white border shadow-sm"
                disabled={entryYear >= maxYear}
              >
                ›
              </button>
            </h3>
            <div className="text-sm text-muted-foreground">{Math.round(entryYear)}</div>
            <div className="flex items-center gap-2"></div>
          </div>

          <ul className="space-y-4">
            {allSkills.map((skill, idx) => {
              const current = Math.max(0, Math.min(100, getLevelAt(skill, entryYear)));
              const baseline = Math.max(0, Math.min(100, getLevelAt(skill, maxYear)));
              const rating = ratingFromPct(current);
              return (
                <li key={skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{skill}</span>
                    <span className="text-xs text-muted-foreground">{rating}</span>
                  </div>
                  <div className="w-full rounded h-3 overflow-hidden relative">
                    <div
                      className="absolute left-0 top-0 h-3 rounded bg-gray-300"
                      style={{ width: `${baseline}%` }}
                    />
                    <div
                      className="absolute left-0 top-0 h-3 rounded bg-amber-400 transition-all duration-300"
                      style={{ width: `${current}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* <div className="col-span-12 md:col-span-8">
          <div className="flex justify-end mb-2">
            
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Use the slider below to move through time and watch skills fill in.
            </p>
          </div>
        </div> */}

        <div className="col-span-12">
          <div className="mt-6 skill-slider-container">
            <div style={{ position: 'relative' }}>
              <input
                type="range"
                min={minYear}
                max={maxYear}
                step={0.1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                onKeyDown={handleSliderKeyDown}
                className="w-full skill-slider"
                aria-label="Select year"
              />

              {/* floating year callout above the thumb */}
              {(() => {
                const t = (entryYear - minYear) / Math.max(1, maxYear - minYear);
                const left = `${t * 100}%`;
                return (
                  <div
                    className="absolute -top-8"
                    style={{ left, transform: 'translateX(-50%)' }}
                    aria-hidden
                  >
                    <div className="px-3 py-1 bg-white border rounded shadow-sm text-sm font-medium">
                      {Math.round(entryYear)}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                {sorted.map((s) => (
                  <button
                    key={s.year}
                    onClick={() => setYear(s.year)}
                    className="text-xs text-muted-foreground hover:text-gray-800"
                    aria-label={`Jump to ${s.year}`}
                  >
                    {s.year}
                  </button>
                ))}
              </div>
              <div className="text-sm font-medium">{entryTitle}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .skill-slider { -webkit-appearance: none; appearance: none; height: 8px; background: #e5e7eb; border-radius: 999px; }
        .skill-slider:focus { outline: none; }
        .skill-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #0ea5e9; border: 4px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.15); margin-top: -7px; }
        .skill-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #0ea5e9; border: 4px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
      `}</style>
    </section>
  );
}

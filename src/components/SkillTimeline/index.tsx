import React, { useEffect, useMemo, useRef, useState } from 'react';

export type SkillLevels = Record<string, number>; // 0-100

export type TimelineEntry = {
  year: number;
  title: string;
  skills: SkillLevels;
};

interface Props {
  /** Accepts either a 'timeline' or an 'experiences' array. Each item should include year,title,skills. */
  timeline?: TimelineEntry[];
  experiences?: TimelineEntry[];
  /** Start index into sorted timeline (defaults to last item) */
  initialIndex?: number;
  /** Controlled active index into the sorted timeline (optional) */
  activeIndex?: number;
  /** Called when the selected index changes (passes index) */
  onSelectedIndexChange?: (i: number) => void;
  /** Start autoplay by default */
  autoplay?: boolean;
  /** Autoplay interval in ms */
  autoplayInterval?: number;
}

export default function SkillTimeline({
  timeline,
  experiences,
  initialIndex,
  activeIndex,
  onSelectedIndexChange,
  autoplay = false,
  autoplayInterval = 800,
}: Props) {
  const source = experiences ?? timeline ?? [];
  const sorted = useMemo(() => [...source].sort((a, b) => a.year - b.year), [source]);

  // Extract technologies from entry supporting multiple common prop names.
  function extractTechs(entry: any): string[] {
    const names = [
      'technologies',
      'technology',
      'tech',
      'tools',
      'tags',
      'stack',
      'technologiesUsed',
      'technologies_used',
    ];
    const out: string[] = [];
    for (const n of names) {
      const v = entry?.[n];
      if (!v) continue;
      if (Array.isArray(v)) {
        for (const it of v) if (typeof it === 'string') out.push(it.trim());
      } else if (typeof v === 'string') {
        // split comma-separated
        v.split(',')
          .map((s) => s.trim())
          .forEach((s) => s && out.push(s));
      } else if (typeof v === 'object') {
        // object keys
        Object.keys(v).forEach((k) => out.push(k));
      }
    }
    return Array.from(new Set(out));
  }

  // Build time series points per skill from sorted entries. If a technology is present
  // but no numeric skill is provided, synthesize a modest starting value (20).
  const skillPoints = useMemo(() => {
    const map: Record<string, { year: number; value: number }[]> = {};
    for (const e of sorted) {
      const entrySkills: Record<string, number> = (e as any).skills ?? {};
      const techs = extractTechs(e);
      const names = new Set<string>([...Object.keys(entrySkills), ...techs]);
      for (const name of names) {
        const raw = entrySkills[name];
        const val = typeof raw === 'number' ? raw : techs.includes(name) ? 20 : 0;
        if (!map[name]) map[name] = [];
        // avoid duplicate year entries for same skill; if exists, keep the max
        const existingIdx = map[name].findIndex((p) => p.year === e.year);
        if (existingIdx >= 0) {
          map[name][existingIdx].value = Math.max(map[name][existingIdx].value, val);
        } else {
          map[name].push({ year: e.year, value: val });
        }
      }
    }
    // sort points for each skill
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.year - b.year);
    return map;
  }, [sorted]);

  const allSkills = useMemo(() => Object.keys(skillPoints).sort(), [skillPoints]);

  // Normalize entries to include explicit start/end years and a resolved title
  const normalizedEntries = useMemo(() => {
    function parseYearField(v: any): number | null {
      if (typeof v === 'number' && !Number.isNaN(v)) return v;
      if (typeof v === 'string') {
        const m = v.match(/(19|20)\d{2}/);
        if (m) return Number(m[0]);
        const n = Number(v);
        if (!Number.isNaN(n)) return n;
      }
      return null;
    }

    return sorted.map((e) => {
      const start =
        parseYearField((e as any).startYear ?? (e as any).start ?? e.year) ?? e.year ?? 0;
      const end = parseYearField((e as any).endYear ?? (e as any).end ?? (e as any).to) ?? start;
      const title =
        (e as any).title || (e as any).role || (e as any).position || (e as any).jobTitle || '';
      const skills = (e as any).skills ?? (e as any).skillLevels ?? {};
      const techs = extractTechs(e as any);
      return { original: e, start, end, title, skills, techs };
    });
  }, [sorted]);

  function findActiveEntry(y: number) {
    // find entry where start <= y <= end. If multiple, pick the one with latest start.
    const matches = normalizedEntries.filter((en) => en.start <= y && y <= en.end);
    if (matches.length > 0) return matches.sort((a, b) => b.start - a.start)[0];
    // fallback: most recent entry that starts before y
    const before = normalizedEntries
      .filter((en) => en.start <= y)
      .sort((a, b) => b.start - a.start);
    if (before.length > 0) return before[0];
    // otherwise earliest
    return normalizedEntries[0] ?? null;
  }

  const years = sorted.map((s) => s.year);
  const minYear = years[0] ?? 0;
  const maxYear = years[years.length - 1] ?? minYear;

  const defaultYear =
    typeof initialIndex === 'number' ? sorted[initialIndex]?.year ?? maxYear : maxYear;
  const [year, setYear] = useState<number>(defaultYear); // target year
  const [animatedYear, setAnimatedYear] = useState<number>(defaultYear); // visually animated year
  const animatedRef = useRef<number>(defaultYear);
  const animationFrameRef = useRef<number | null>(null);
  const animationStartRef = useRef<number | null>(null);
  const animationDurationRef = useRef<number>(600);
  const [playing, setPlaying] = useState<boolean>(autoplay);
  const intervalRef = useRef<number | null>(null);
  const step = 0.5; // year step for autoplay
  // time-series displayed values for skills (separate from interpolation helper)
  const [tsValues, setTsValues] = useState<Record<string, number>>({});
  const tsAnimRef = useRef<number | null>(null);
  const prevActiveRef = useRef<any>(null);

  // If `activeIndex` is provided (controlled), sync year with it.
  useEffect(() => {
    if (typeof activeIndex === 'number') {
      const idx = Math.max(0, Math.min(sorted.length - 1, activeIndex));
      const y = sorted[idx]?.year ?? maxYear;
      setYear(y);
    }
  }, [activeIndex, sorted, maxYear]);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  // Animate `animatedYear` toward `year` using requestAnimationFrame for smooth motion
  useEffect(() => {
    // cancel any existing animation
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const from = animatedRef.current ?? animatedYear;
    const to = Math.max(minYear, Math.min(maxYear, year));
    const diff = Math.abs(to - from);
    const duration = Math.min(1200, Math.max(200, diff * 250));
    animationDurationRef.current = duration;
    animationStartRef.current = null;

    const stepFn = (ts: number) => {
      if (animationStartRef.current == null) animationStartRef.current = ts;
      const elapsed = ts - (animationStartRef.current as number);
      const t = Math.min(1, elapsed / animationDurationRef.current);
      const eased = easeOutCubic(t);
      const val = from + (to - from) * eased;
      animatedRef.current = val;
      setAnimatedYear(val);
      if (t < 1) {
        animationFrameRef.current = window.requestAnimationFrame(stepFn);
      } else {
        // finish
        animatedRef.current = to;
        setAnimatedYear(to);
        animationFrameRef.current = null;
        animationStartRef.current = null;
        // notify parent of nearest index at completion
        if (onSelectedIndexChange) onSelectedIndexChange(yearToIndex(to));
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(stepFn);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, minYear, maxYear]);

  // Manage time-series values in a separate state. When the active entry changes
  // or the animated year moves, compute target values based on current and previous
  // roles and animate tsValues toward those targets for smooth visual transitions.
  useEffect(() => {
    const active = findActiveEntry(entryYear);
    const prev = prevActiveRef.current;

    // determine skill set to consider (union of prev and current role skills/techs)
    const names = new Set<string>();
    if (prev) {
      Object.keys(prev.skills || {}).forEach((s) => names.add(s));
      (prev.techs || []).forEach((s: string) => names.add(s));
    }
    if (active) {
      Object.keys(active.skills || {}).forEach((s) => names.add(s));
      (active.techs || []).forEach((s: string) => names.add(s));
    }

    // build target values using the interpolation function at the current animated year
    const targets: Record<string, number> = {};
    names.forEach((skill) => {
      const v = Math.max(0, Math.min(100, getLevelAt(skill, entryYear)));
      targets[skill] = v;
    });

    // also ensure existing tsValues keys remain (so bars don't disappear abruptly)
    Object.keys(tsValues).forEach((k) => {
      if (!targets.hasOwnProperty(k)) targets[k] = tsValues[k];
    });

    // cancel any existing animation
    if (tsAnimRef.current) {
      window.cancelAnimationFrame(tsAnimRef.current);
      tsAnimRef.current = null;
    }

    const from = { ...tsValues };
    const duration = 400; // ms for value transitions
    const startRef = { t: 0 } as any;

    const stepFn = (ts: number) => {
      if (!startRef.t) startRef.t = ts;
      const elapsed = ts - startRef.t;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const next: Record<string, number> = {};
      Object.keys(targets).forEach((k) => {
        const a = typeof from[k] === 'number' ? from[k] : targets[k];
        const b = targets[k];
        next[k] = Math.round((a + (b - a) * eased) * 100) / 100;
      });
      setTsValues(next);
      if (t < 1) tsAnimRef.current = window.requestAnimationFrame(stepFn);
      else tsAnimRef.current = null;
    };

    // kickoff animation
    tsAnimRef.current = window.requestAnimationFrame(stepFn);

    // store active as prev for next change
    prevActiveRef.current = active;

    return () => {
      if (tsAnimRef.current) {
        window.cancelAnimationFrame(tsAnimRef.current);
        tsAnimRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedYear]);

  // Autoplay effect: increment year while playing
  useEffect(() => {
    if (playing) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setYear((y) => {
          const next = Math.min(maxYear, Math.round((y + step) * 10) / 10);
          if (onSelectedIndexChange) onSelectedIndexChange(yearToIndex(next));
          if (next >= maxYear) setPlaying(false);
          return next;
        });
      }, autoplayInterval);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, autoplayInterval, maxYear]);

  useEffect(() => {
    setYear((y) => Math.max(minYear, Math.min(maxYear, y)));
  }, [minYear, maxYear]);

  function yearToIndex(y: number) {
    if (sorted.length === 0) return 0;
    let best = 0;
    let bestDiff = Math.abs(sorted[0].year - y);
    for (let i = 1; i < sorted.length; i++) {
      const d = Math.abs(sorted[i].year - y);
      if (d < bestDiff) {
        bestDiff = d;
        best = i;
      }
    }
    return best;
  }

  const goPrev = () => {
    const next = Math.max(minYear, year - 1);
    setYear(next);
  };

  const goNext = () => {
    const next = Math.min(maxYear, year + 1);
    setYear(next);
  };

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

  // When the range slider changes, update year and notify parent with the nearest index.
  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setYear(v);
  }

  const entryYear = animatedYear;

  function getLevelAt(skill: string, y: number) {
    const points = skillPoints[skill];
    if (!points || points.length === 0) return 0;
    if (points.length === 1) return points[0].value;
    if (y <= points[0].year) return points[0].value;
    if (y >= points[points.length - 1].year) return points[points.length - 1].value;
    // find interval safely
    let i = 0;
    while (i < points.length - 1 && !(points[i].year <= y && y <= points[i + 1].year)) i++;
    if (i >= points.length - 1) {
      return points[points.length - 1].value;
    }
    const a = points[i];
    const b = points[i + 1];
    const denom = b.year - a.year || 1;
    const t = (y - a.year) / denom;
    return a.value + (b.value - a.value) * t;
  }

  function ratingFromPct(pct: number) {
    if (pct <= 25) return 'Beginner';
    if (pct <= 50) return 'Intermediate';
    if (pct <= 75) return 'Advanced';
    return 'Expert';
  }

  const entryTitle = (() => {
    const active = findActiveEntry(entryYear);
    if (!active) return '';
    return active.title || (active.original && (active.original as any).title) || '';
  })();

  return (
    <section>
      <div className="grid grid-cols-12 gap-6 items-start border border-gray-100 p-8">
        <h2 className="col-span-12 text-center font-semibold text-lg">My Journey</h2>
        <div className="col-span-12 text-center">
          <div className="mb-4">
            <h3 className="text-md font-semibold">
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

            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="text-sm text-muted-foreground">{Math.round(entryYear)}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Pause autoplay' : 'Start autoplay'}
                  className="px-2 py-1 rounded-md bg-white border shadow-sm"
                >
                  {playing ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => {
                    setYear(minYear);
                  }}
                  className="px-2 py-1 rounded-md bg-white border shadow-sm"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2"></div>
          </div>

          <ul className="space-y-3">
            {(() => {
              // determine active entry and build skills from that role
              const active = findActiveEntry(entryYear);
              if (!active) return null;

              const names = new Set<string>([
                ...Object.keys(active.skills || {}),
                ...(active.techs || []),
              ]);
              const skillValues = Array.from(names).map((skill) => {
                // displayed current value comes from tsValues (smoothed), fallback to interpolation
                const interpolated = Math.max(0, Math.min(100, getLevelAt(skill, entryYear)));
                const current = Math.max(0, Math.min(100, tsValues[skill] ?? interpolated));
                const prevInterpolated = Math.max(
                  0,
                  Math.min(100, getLevelAt(skill, Math.max(minYear, entryYear - 0.25)))
                );
                const prevVal = tsValues[skill] ?? prevInterpolated;
                const isBuilding = current > prevVal + 0.5;
                return { skill, current, prev: prevVal, isBuilding };
              });

              skillValues.sort((a, b) => b.current - a.current);
              const top = skillValues.slice(0, 10);

              return top.map(({ skill, current, isBuilding }) => {
                const rating = ratingFromPct(current);
                return (
                  <li
                    key={skill}
                    className="skill-item flex items-center justify-between"
                    style={{
                      transformOrigin: 'left',
                      transition: 'transform 300ms, opacity 300ms',
                    }}
                  >
                    <div className="w-1/2 pr-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{skill}</span>
                        <span className="text-xs text-muted-foreground">{rating}</span>
                      </div>
                      <div className="w-full rounded h-3 overflow-hidden relative bg-gray-100">
                        <div
                          className={`absolute left-0 top-0 h-3 rounded ${
                            isBuilding ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${current}%`, transition: 'width 600ms ease' }}
                        />
                      </div>
                    </div>
                    <div className="w-1/2 text-right pl-4 text-sm font-medium">
                      {Math.round(current)}%
                    </div>
                  </li>
                );
              });
            })()}
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
                value={animatedYear}
                onChange={handleSliderChange}
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

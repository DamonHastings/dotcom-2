import React from 'react';

export interface HighlightItem {
  label: string;
  value: string;
  note?: string;
}

const defaults: HighlightItem[] = [
  { label: 'Expertise', value: 'Full-Stack Software Engineer' },
  { label: 'Experience', value: '15+ years', note: 'professional SWE experience' },
  { label: 'Leadership', value: '4 years', note: 'Non-Profit Leadership' },
  { label: 'Creative Work', value: 'Media Design & Production' },
];

export default function CareerHighlights({ items }: { items?: HighlightItem[] }) {
  const list = items && items.length ? items : defaults;
  return (
    <section className="max-w-6xl mx-auto mb-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {list.map((it, i) => (
          <div key={i} className="bg-white/80 dark:bg-white px-4 py-3 ">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{it.label}</div>
            <div className="text-xl font-bold mt-1">{it.value}</div>
            {it.note ? <div className="text-sm text-muted-foreground mt-1">{it.note}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

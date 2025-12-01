import React from 'react';

// Lightweight runtime-only component — keep types out of the file so parsers
// that don't fully support TSX function parameter annotations can still parse it.
// Expected shape for `items`: [{ id?, period, company, role?, summary? }]
function SummaryTimeline(props) {
  const items = props && Array.isArray(props.items) ? props.items : props.items ? props.items : [];
  const list = items || [];
  return (
    <div className="relative pr-6">
      {/* vertical line on the right */}
      <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-gray-300/60" aria-hidden />

      <ul className="space-y-12">
        {list.map((it) => {
          const period = it.period == null ? '' : String(it.period);
          const company = it.company == null ? '' : String(it.company);
          const role = it.role == null ? '' : String(it.role);
          const summary = it.summary == null ? '' : String(it.summary);
          return (
            <li key={it.id ?? `${company}-${period}`} className="flex items-start">
              <div className="flex-1 pr-6 text-right">
                <div className="text-sm text-gray-400 font-semibold">{period}</div>
                <div className="text-base font-medium text-white">{company}</div>
                <div className="text-sm text-gray-300">{role}</div>
                {summary ? (
                  <p className="mt-2 text-sm text-gray-300 leading-snug">{summary}</p>
                ) : null}
              </div>

              {/* Dot + connector area */}
              <div className="w-6 flex items-start justify-center relative">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-cyan-400 mt-1 shadow-sm" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SummaryTimeline;

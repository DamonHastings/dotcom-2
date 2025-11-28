import React from 'react';

type Props = {
  availableSlots: string[];
  selected?: string | null;
  onSelect: (slot: string) => void;
};

export default function TimeSelector({ availableSlots, selected, onSelect }: Props) {
  if (!availableSlots || availableSlots.length === 0)
    return <div className="text-sm text-muted-foreground">No available times.</div>;

  return (
    <div className="grid grid-cols-1 gap-2">
      {availableSlots.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`text-left px-3 py-2 rounded-md border ${
            selected === s ? 'bg-orange-200 border-orange-300' : 'bg-white border-gray-200'
          }`}
        >
          {new Date(s).toLocaleString()}
        </button>
      ))}
    </div>
  );
}

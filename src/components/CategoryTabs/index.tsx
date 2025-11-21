import React, { useState } from 'react';

export interface CategoryTabsProps {
  categories: string[];
  initialActive?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function CategoryTabs({
  categories,
  initialActive = 0,
  onChange,
  className = '',
}: CategoryTabsProps) {
  const [active, setActive] = useState(initialActive);
  return (
    <div className={`flex flex-wrap items-end gap-10 text-sm md:text-base ${className}`}>
      {categories.map((cat, i) => {
        const isActive = i === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setActive(i);
              onChange?.(i);
            }}
            className={`relative font-semibold pb-3 transition-colors ${
              isActive ? 'text-gray-900 dark:text-black' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {cat}
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-px bg-gray-400 dark:bg-gray-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;

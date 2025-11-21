import React from 'react';
import useTheme from '../../hooks/useTheme';

const Sun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const Moon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function ThemeToggle() {
  const { toggle } = useTheme();

  // Render both icons and rely on CSS (tailwind `dark:`) to toggle visibility.
  // This prevents a hydration mismatch between server and client when theme
  // is computed on the client (localStorage / prefers-color-scheme).
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="p-2 rounded-md border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span className="hidden dark:inline">
        <Sun className="w-5 h-5" />
      </span>
      <span className="inline dark:hidden">
        <Moon className="w-5 h-5" />
      </span>
    </button>
  );
}

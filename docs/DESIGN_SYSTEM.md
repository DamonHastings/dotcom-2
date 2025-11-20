# Design System

## Purpose

The Design System documents the visual tokens, layout rules, accessibility requirements, and component principles used across the portfolio site. It is intentionally small and pragmatic — designed to help build consistent UI quickly while prioritizing accessibility and performance.

## Foundations

- Colors (example tokens):

  - `--color-bg`: `#0f172a` (dark) / `#ffffff` (light)
  - `--color-surface`: `#111827` / `#f8fafc`
  - `--color-primary`: `#7c3aed` (purple)
  - `--color-accent`: `#06b6d4` (teal)
  - `--color-muted`: `#94a3b8`
  - `--color-text`: `#e6eef8` / `#0b1220`

- Typography:

  - Base font: Inter or system UI stack
  - Scale: 16px base; 1.125x modular scale
  - Headings: Bold weights (600–800); body regular (400)

- Spacing & Layout:
  - Spacing unit: 4px (use multiples for padding/margins)
  - Container widths: `max-w-screen-md` for content, `max-w-screen-xl` for wide layouts
  - Breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px

## Dark Mode

- Prefer semantic tokens (surface, muteds, accents) so the theme can swap values.
- Persist user preference in `localStorage` and respect `prefers-color-scheme`.

## Accessibility

- Contrast: All text must meet WCAG AA contrast against background.
- Keyboard focus: Visible focus ring for all interactive controls (`:focus-visible`).
- Motion: Provide `prefers-reduced-motion` support to disable non-essential animations.

## Icons & Imagery

- Use an icon sprite or SVG components. Keep icons monochrome with CSS color for theming.
- Use optimized images and the Next.js `Image` component for responsive images.

## Component Principles

- Small, composable components — favor composition over deep inheritance.
- Keep components stateless where possible; accept props for content and callbacks.
- Provide accessible variants (aria-labels, role, semantic HTML).

## Tokens (example CSS variables)

```
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --radius-sm: 6px;
  --radius-md: 12px;
  --shadow-sm: 0 1px 2px rgba(2,6,23,0.4);
}
```

## Design Deliverables

- `docs/COMPONENT_GUIDELINES.md` — usage and accessibility guidelines for components.
- Base `tailwind.config.js` recommended for token mapping.

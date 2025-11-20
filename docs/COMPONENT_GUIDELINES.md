# Component Guidelines

This document provides conventions and recommended props/behaviors for the core components used across the site.

## Buttons

- Variants: `primary`, `secondary`, `ghost`, `link`.
- Accessibility:
  - Use `<button>` or `<a role="button">` semantics.
  - Include `aria-label` when text is not descriptive.
  - Provide `:focus-visible` styles.
- Example props: `size` (`sm|md|lg`), `variant`, `disabled`, `onClick`.

## Cards

- Purpose: project cards, feature cards — concise summary with image, title, short excerpt, tags, CTA.
- Structure: image (optional), title (h3), excerpt (p), tags (list), CTA(s).
- Accessibility: use semantic headings and links; ensure card link covers expected clickable area.

## Avatars

- Small circular images with fallback initials.
- Use `alt` text and ensure image sizes are constrained to prevent layout shifts.

## Forms

- Inputs: label above input, `id`+`for`, helper text below, error messages in-line.
- Validation: client-side feedback (aria-invalid=true) and server-side validation.
- Spam protection: reCAPTCHA token hidden input; server verifies token.

## Layout Components

- `Container` — centers content with consistent horizontal padding and max width.
- `Grid` — responsive column layout for project cards and galleries.

## Animation & Motion

- Use Framer Motion for enter/exit animations and micro-interactions.
- Respect `prefers-reduced-motion` — detect and reduce/disable motion accordingly.

## Testing & Accessibility

- Each component should expose a simple API easy to test with React Testing Library.
- Add Storybook or Playground entries for each component with examples.

## Naming & File Layout

- `src/components/<ComponentName>/index.tsx` — component
- `src/components/<ComponentName>/<ComponentName>.stories.tsx` — story (if using Storybook)
- `src/components/<ComponentName>/styles.css` or Tailwind class usage

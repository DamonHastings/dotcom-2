**Component Guidelines**

- **Avatar**: `src/components/Avatar`

  - Props: `src?: string`, `alt?: string`, `size?: number`
  - Use for user or project thumbnails; uses `next/image` for optimization. Add host domains in `next.config.js` if needed.

- **Card**: `src/components/Card`

  - A simple container with light/dark backgrounds. Use for content blocks and project cards.

- **ThemeToggle**: `src/components/ThemeToggle`

  - Toggles dark/light mode. It persists selection via `localStorage` and respects system preference.
  - For SSR hydration safety the component renders both icons and relies on CSS for visibility.

- **Form controls**: `src/components/Form`

  - `Input` and `Textarea`: accessible labels, focus styles, and dark-mode support.

- **Icons**: `src/components/icons.tsx`
  - Exports named icons (`IconGithub`, `IconMail`, `IconExternal`). Avoid default anonymous exports to satisfy linting.

Examples

Avatar:

```tsx
<Avatar src="https://images.unsplash.com/..." alt="Author" size={64} />
```

Card + CTA:

```tsx
<Card>
  <h3>Featured</h3>
  <p>Short blurb</p>
  <Button>Learn more</Button>
</Card>
```

Form:

```tsx
<form>
  <Input label="Name" name="name" />
  <Textarea label="Message" name="message" />
  <Button type="submit">Send</Button>
</form>
```

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

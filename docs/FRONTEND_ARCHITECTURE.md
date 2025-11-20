# Frontend Architecture

## Purpose

This document describes the recommended frontend architecture for the portfolio site. It focuses on structure, rendering strategies, data flow, state management, styling, accessibility, testing, and deployment patterns — optimized for a Next.js + TypeScript app.

## Goals

- Fast, SEO-friendly pages (good Lighthouse scores)
- Simple developer ergonomics and predictable data fetching
- Accessibility-first components and keyboard-friendly UI
- Easy CMS integration and safe server-side operations for secrets

## Core Technologies

- Framework: Next.js (TypeScript)
- Styling: Tailwind CSS + design tokens (CSS variables)
- Data fetching: Next.js SSG/ISR + SWR or React Query for client cache
- Forms / server work: Next.js API routes (serverless)
- Images: Next.js `next/image` with Vercel Image CDN (or external CDN)
- Animations: Framer Motion (respect `prefers-reduced-motion`)
- Testing: Jest + React Testing Library, Playwright or Cypress for E2E

## Repository Structure (recommended)

```
/docs
/public
  /images
  /social
src/
  /components
    /Button
    /Card
    /Layout
  /pages
    /api
      contact.ts
    index.tsx
    about.tsx
    skills.tsx
    projects/[slug].tsx
    projects/index.tsx
  /styles
    globals.css
  /lib
    cms.ts
    sanityClient.ts
    api.ts
  /hooks
    useTheme.ts
    useProjects.ts
  /utils
  /types
package.json
next.config.js
tailwind.config.js
```

## Routing & Pages

- Use Next.js file-based routing. Keep routes shallow and semantic: `/`, `/about`, `/projects`, `/projects/:slug`, `/blog/:slug`.
- Page components should be thin: fetch data in `getStaticProps`/`getStaticPaths` and pass into presentational components.

## Rendering & Data Fetching Strategy

- Static pages (Home, About, Skills) — `getStaticProps` at build time.
- Projects and blog listing — SSG with `revalidate` (ISR) so CMS updates can show up without full deploy.
- Individual project/blog pages — `getStaticPaths` + `getStaticProps` with ISR revalidation via CMS webhook.
- Dynamic or personalized pages (admin, previews) — `getServerSideProps` when necessary.
- Client-side data (e.g., user interactions, filtered lists) — use `SWR` or `React Query` to keep UI snappy and cached.

Example: `getStaticProps` with ISR

```
export const getStaticProps: GetStaticProps = async () => {
  const projects = await fetchProjectsFromCMS();
  return {
    props: { projects },
    revalidate: 60, // seconds
  };
};
```

## CMS Integration Pattern

- Use a headless CMS (Sanity, Contentful) to author Projects and BlogPost entries.
- On content change, configure a webhook on the CMS to call a Vercel endpoint that triggers ISR revalidation for affected pages (or redeploy).
- Keep read-only CMS tokens in the frontend as `NEXT_PUBLIC_` if necessary for public reads; keep write tokens server-side only.

## API Routes & Contact Flow

- Implement `src/pages/api/contact.ts` as a serverless handler.
- Flow:
  1. Client validates fields and obtains a reCAPTCHA token.
  2. Client POSTs `{ name, email, subject, message, recaptchaToken }` to `/api/contact`.
  3. Server verifies reCAPTCHA with Google and rate-limits by IP.
  4. Server sends email via SendGrid and persists the message to MongoDB Atlas.
  5. Server returns a stable success/failure payload.

## State Management

- Local UI state: React `useState` / `useReducer` inside components.
- Cross-cutting state: React Context for theme, site settings, and auth (if admin features are added).
- Remote data: `SWR` or `React Query` for fetching and caching CMS-backed lists, with optimistic updates where appropriate.

## Styling & Theming

- Use Tailwind CSS for utility-first styling and map design tokens via `tailwind.config.js`.
- Provide semantic CSS variables for colors, then map those into Tailwind themes for dark mode.
- Theme toggler persists choice in `localStorage` and respects `prefers-color-scheme`.

## Components & Patterns

- Components are small, documented, and testable. Prefer composition.
- Folder layout: `src/components/<ComponentName>/` with `index.tsx`, `types.ts`, and optional `stories`.
- Accessibility:
  - Use proper semantics (`<button>`, `<nav>`, headings, landmarks).
  - Provide `aria-*` attributes where required and `:focus-visible` styles for keyboard users.
  - Ensure color contrast meets WCAG AA.

## Images & Assets

- Use Next.js `Image` component for automatically sized images and lazy-loading.
- Store social preview images in `public/social/` and generate Open Graph images for featured projects.
- For large assets or editorial images, use Cloudinary or Sanity Image CDN and whitelist domains in `next.config.js`.

## Performance & SEO

- Pre-render content with SSG/ISR to maximize speed and SEO.
- Use `next/head` to add SEO meta tags, Open Graph, and JSON-LD structured data for author and projects.
- Generate `sitemap.xml` at build time and include canonical URLs.
- Optimize images and fonts (use `next/font` or host fonts locally), minimize render-blocking CSS.

## Testing Strategy

- Unit tests: Jest + React Testing Library for components and utilities.
- Integration/E2E: Playwright or Cypress for flows (submit contact form, navigate projects, mobile view).
- Accessibility tests: axe-core integration in unit tests and E2E runs.

## Error Handling & Observability

- Client: show friendly toast/errors for network problems; track events with Google Analytics.
- Server: use Sentry to capture exceptions from API routes and client-side runtime errors.
- Logging: keep server logs minimal and use structured logging (JSON) if aggregating.

## CI / Local Dev / Scripts

- Common scripts in `package.json`:

```
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"format": "prettier --write .",
"test": "jest",
"type-check": "tsc --noEmit"
```

- Local environment:

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

## Environment Variables (examples)

- `NEXT_PUBLIC_SITE_URL` — public URL
- `NEXT_PUBLIC_GA_ID` — GA tracking id
- `SENDGRID_API_KEY` — server only
- `MONGODB_URI` — server only
- `RECAPTCHA_SECRET` — server only
- `SANITY_PROJECT_ID` / `SANITY_DATASET` — CMS read config

## Security Notes

- Never commit secrets; use hosting provider secret management.
- Rate-limit API endpoints and validate inputs server-side.
- Use HTTPS and HSTS; enforce CSP headers via `next.config.js` or middleware.

## Preview & CMS Editing Workflow

- Enable preview mode using Next.js preview API to render draft content from CMS.
- CMS webhook should POST to `/api/revalidate` (a serverless route) that calls `res.revalidate('/projects')` or the specific `slug` paths.

Sample `next.config.js` snippets

```
module.exports = {
  images: {
    domains: ['cdn.sanity.io', 'images.unsplash.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
```

## Where to document further

- Link components to `docs/COMPONENT_GUIDELINES.md` and design tokens in `docs/DESIGN_SYSTEM.md`.
- Add Storybook (optional) for visual component playground and regression tests.

## Next Steps (suggested)

- Scaffold project skeleton (Next.js + TypeScript + Tailwind) and commit as the first feature (`feat/bootstrap`).
- Implement `pages/api/contact.ts` with validation and tests as the next commit.
- Add Storybook and a few core components with stories.

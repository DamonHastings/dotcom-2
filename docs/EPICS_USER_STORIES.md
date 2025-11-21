# Epics, User Stories, and Tasks

This document breaks the project into Epics and user stories suitable for Agile sprints.

## Epic A — Project Foundation

Story A1: Repository & Hosting

- Tasks:

  - Create GitHub repo and populate `README.md` with project overview and setup steps
  - Define branch strategy and workflow (`main`, `develop`, `feat/*`) with examples
  - Add standard repository files: `.gitignore`, `LICENSE`, `CODEOWNERS`, issue and PR templates
  - Add a minimal CI that runs the build and tests on PRs (GitHub Actions or equivalent)
  - Protect `main` branch: require PR reviews and passing CI checks before merge
  - Connect repository to Vercel and create a `staging` deployment environment
  - Add deploy preview configuration and check that preview URLs are available on PRs

- Acceptance Criteria:
  - A functioning GitHub repository exists with `README.md` and the above repo files.
  - CI runs on PRs and fails when tests/build fail.
  - `main` branch protection is configured and enforced.
  - Vercel is connected and `staging` deploys successfully with preview URLs for PRs.

Story A2: Design System

- Tasks:

  - Create `tailwind.config.js` with base tokens and sensible defaults
  - Define and document tokens for typography, colors, spacing, and breakpoints
  - Establish accessible color contrast baselines and focus-visible outlines
  - Create lightweight component skeletons with stories/docs for: `Button`, `Card`, `Avatar`, `Icon` set, `Input`, `Textarea`
  - Add a simple `components/README.md` describing usage, props, and examples
  - Add linting/formatting config for consistent styles (ESLint, Prettier) and a basic accessibility/axe check in CI
  - Create initial visual regression baseline snapshots (optional, e.g., Chromatic or Percy)

- Acceptance Criteria:
  - `tailwind.config.js` is present and tokens are defined in the repository.
  - Basic components exist in `src/components/` with examples or test snapshots.
  - Component usage is documented in `components/README.md` or inline story files.
  - Accessibility checks run in CI and report issues (no critical a11y failures for base components).

Notes and Deliverables:

- Keep component implementations small and focused so they can be iterated on.
- Prioritize accessibility and consistency over visual polish in early sprints.
- Link component documentation to the main `README.md` so contributors can find it easily.

## Epic B — Core Pages (MVP)

Story B1: Home Page

- Tasks:

  - Implement a responsive hero component with headline, short copy, and primary CTA
  - Add a featured projects section (card grid) with links to project detail pages
  - Add a contact CTA and wire basic analytics events for CTA clicks
  - Ensure hero and featured sections are keyboard-accessible and responsive at common breakpoints

- Acceptance Criteria:
  - Hero displays correctly on mobile, tablet, and desktop and CTA is reachable via keyboard
  - Featured projects show at least 3 items with working links to project pages
  - Analytics events are emitted on CTA clicks (console/event stub acceptable for MVP)

Story B2: About Page

- Tasks:

  - Add biography section with concise copy and a downloadable resume link
  - Implement a timeline or role history showing past positions and responsibilities
  - Add a contact CTA or link back to the contact form

- Acceptance Criteria:
  - Biography content is readable at all viewports and resume link downloads a `pdf` file
  - Timeline entries are accessible (semantic markup) and visually distinct

Story B3: Skills

- Tasks:

  - Implement a categorized skills list (languages, frameworks, tools) with simple proficiency indicators (e.g., bars or dots)
  - Add client-side filtering by skill type and optional search by name
  - Make items keyboard-navigable and provide aria-labels for screen readers

- Acceptance Criteria:
  - Skills are grouped and can be filtered without page reload
  - Proficiency indicators have accessible labels (e.g., `aria-label="JavaScript — proficient"`)

Story B4: Projects

- Tasks:

  - Create a projects list page with a responsive card grid and tag-based filters
  - Implement project detail pages (or modal) with description, images, links, and tech stack
  - Provide an easy way to add new projects (local markdown or JSON for MVP) and document the format

- Acceptance Criteria:
  - Projects list shows cards with title, short excerpt, and tags; clicking leads to detail view
  - Detail pages include at least one image, links (live/demo/github), and a tech stack section
  - New project format is documented in `docs/` or `README.md`

Story B5: Contact Form

- Tasks:

  - Build a contact form UI with client-side validation and friendly error messages
  - Implement a serverless API route (`/api/contact`) that validates input and returns proper status codes
  - Integrate server sending via SendGrid and persist messages in the DB (MongoDB) or queue; provide mocks for local/dev
  - Add spam protection strategy (reCAPTCHA or honeypot) and rate-limiting on the API

- Acceptance Criteria:
  - Form validates required fields client-side and server-side; returns 200 on success and 400 on bad input
  - Email send and DB store are called (stubs accepted in dev); test coverage present for happy/error flows
  - Spam protection is enabled and rate-limiting prevents rapid repeated submissions

Notes and Deliverables for Epic B:

- Deliver minimal, accessible UI first; polish visuals after functionality is stable.
- Provide example project content in `src/projects` or `data/projects.md` for demos.
- Add unit tests for critical flows: contact API, project list rendering, and theme toggle (if applicable).
- Document content formats and required fields for projects and contact payloads in `docs/`.

## Epic C — CMS & Blog

Story C1: CMS Models

- Tasks:
  - Create `Project` and `BlogPost` schemas in chosen CMS
  - Add sample content and configure preview/webhook

Story C2: Blog UI

- Tasks:
  - Blog listing with pagination and tag filters
  - Blog detail pages with share buttons and reading time

## Epic D — Quality & Operations

Story D1: Testing

- Tasks:
  - Add unit tests for critical components (Jest + Testing Library)
  - Add E2E tests for contact flow (Playwright or Cypress)

Story D2: Monitoring & Analytics

- Tasks:
  - Add GA4 and event tracking
  - Integrate Sentry for error monitoring

## Epic E — Enhancements

Story E1: Dark Mode

- Tasks:
  - Theme toggler, localStorage persistence, system preference

Story E2: Animations & Micro-interactions

- Tasks:
  - Add Framer Motion to hero and project cards
  - Add subtle hover states and focus-visible styles

## Sprint Planning Notes

- Each sprint should focus on a small set of stories that produce a reviewable increment.
- Early sprints: foundation, layout, home, contact form.
- Mid sprints: projects, CMS hookup, blog UI.
- Final sprints: tests, optimization, launch checklist.

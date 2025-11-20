# Epics, User Stories, and Tasks

This document breaks the project into Epics and user stories suitable for Agile sprints.

## Epic A — Project Foundation

Story A1: Repository & Hosting

- Tasks:
  - Create GitHub repo and README
  - Define branch strategy (`main`, `develop`, `feat/*`)
  - Add `.gitignore`, license, PR template, and CODEOWNERS
  - Connect repo to Vercel and configure staging environment

Story A2: Design System

- Tasks:
  - Create `tailwind.config.js` and base tokens
  - Implement typography, color, spacing tokens
  - Build base components: `Button`, `Card`, `Avatar`, `Icon` set

## Epic B — Core Pages (MVP)

Story B1: Home Page

- Tasks:
  - Implement hero component with CTA
  - Add featured projects section
  - Add contact CTA and basic analytics event tracking

Story B2: About Page

- Tasks:
  - Add biography, timeline, resume download
  - Showcase roles: engineering, design, production

Story B3: Skills

- Tasks:
  - Implement categorized skills list with proficiency indicators
  - Add filtering by skill type (languages, frameworks, tools)

Story B4: Projects

- Tasks:
  - Projects list page with card grid, tag filter
  - Project detail page or modal with images and links
  - Connect projects to CMS content (post-MVP) or local markdown

Story B5: Contact Form

- Tasks:
  - Implement UI with client validation
  - Add reCAPTCHA and serverless API route
  - Connect to SendGrid and store messages in MongoDB

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

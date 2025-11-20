# Project Scope

## Purpose

This repository contains the source and documentation for a personal portfolio website. The site serves as a marketing and engagement platform for a software engineer offering full-stack development, product design, creative direction, and consulting services.

## Primary Goals

- Present an approachable, professional online portfolio that highlights skills, projects, services, and contact options.
- Provide a fast, accessible, and search-engine-friendly site with a modern, responsive UI.
- Offer an extensible platform that can grow from a small MVP to a full-featured site with a blog, CMS-managed content, and integrations.

## Target Audience

- Potential employers and hiring managers
- Potential clients and collaborators
- Peers and the developer community

## Success Metrics

- Launch a functional MVP with Home, About, Skills, Projects, and Contact pages.
- Contact form submissions and inbound inquiries (goal: N inquiries/month after launch).
- Lighthouse performance score >= 90 (desktop) and >= 80 (mobile) for MVP pages.
- Accessibility (WCAG 2.1 AA) — no critical violations on core pages.

## Out of Scope (MVP)

- Full blog authoring workflow (CMS-backed blog will be added post-MVP).
- Complex e-commerce or booking flows.
- Multi-user admin panel for content editing (CMS will handle content administration).

## Deliverables (MVP)

- Staging site and production site hosted on Vercel (recommended).
- Source code in GitHub with CI for builds and tests.
- Documentation in `/docs` including Technical Design, Dev Setup, and Deployment instructions.
- Basic analytics (GA4) and monitoring (Sentry optional).

## Timeline (High Level)

- Phase 1 — Planning & Setup: Week 1–2
- Phase 2 — MVP Development: Week 3–6
- Phase 3 — Testing & Feedback: Week 7
- Phase 4 — Enhancements: Week 8–12
- Phase 5 — Optimization: Week 13–16
- Phase 6 — Final Testing & Launch: Week 17
- Phase 7 — Post-Launch Maintenance: Ongoing

## Acceptance Criteria (MVP)

- All MVP pages implemented and responsive across breakpoints.
- Contact form validates client-side, verifies reCAPTCHA, stores messages, and sends email notifications.
- Basic SEO implemented (meta tags, sitemap.xml, robots.txt).
- CI building and deploying staging on merge.

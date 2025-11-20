# Technical Design Document

## Overview

This document describes the recommended architecture, technology choices, data models, and operational patterns for the personal portfolio website.

## High-Level Architecture

- Frontend: Next.js (TypeScript) — hybrid SSG/SSR with client-side hydration for interactive elements.
- Styling: Tailwind CSS with a small design system of reusable components.
- Animations: Framer Motion for micro-interactions.
- CMS: Sanity or Contentful (headless CMS) for Projects and Blog content.
- Backend: Next.js API routes (serverless) for contact form and lightweight server-side tasks.
- Database: MongoDB Atlas to store contact messages and optional visitor events.
- Email: SendGrid or Mailgun for transactional emails from the contact form.
- Hosting/CD: Vercel (recommended) — automatic deploys, image CDN, ISR support.

## Why these choices

- Next.js provides SEO-friendly rendering (SSG & SSR), Image optimization, and a smooth developer experience.
- Tailwind supports rapid styling with consistent design tokens and low CSS overhead.
- Sanity (or Contentful) provides an editor-friendly CMS that supports structured content and webhooks for ISR.
- Vercel integrates tightly with Next.js and simplifies CI/CD and environment management.

## Pages & Rendering Strategy

- Home: SSG with revalidate (ISR) for featured projects.
- About: SSG.
- Skills: SSG.
- Projects: List page SSG; individual project pages SSG + ISR triggered by CMS webhooks.
- Contact: Client-side form submits to `/api/contact` (serverless) which performs validation and sends email.

## API Endpoints (serverless)

- POST `/api/contact`
  - Request: { name, email, subject, message, recaptchaToken }
  - Flow: verify reCAPTCHA, validate payload, rate-limit by IP, send email via SendGrid, store message in MongoDB.
  - Responses: 200 { success: true } | 400 validation | 429 rate-limited | 500 server error

## Data Models (simplified)

- Project

  - id (string)
  - title (string)
  - slug (string)
  - excerpt (string)
  - description (rich text)
  - tech (string[])
  - repoUrl (string)
  - demoUrl (string)
  - images (string[])
  - featured (boolean)

- BlogPost

  - id, title, slug, excerpt, content, tags, author, publishedAt, coverImage

- ContactMessage
  - id, name, email, subject, message, sourceUrl, createdAt, handled (boolean)

## Security

- Store all secrets in Vercel environment variables or GitHub Secrets.
- Protect the contact form with Google reCAPTCHA v3 or v2.
- Rate-limit the contact endpoint to mitigate spam.
- Use CSP, HSTS, and secure headers (can set via Next.js middleware or hosting environment).
- Validate and sanitize all inputs server-side before storing or sending email.

## Performance & SEO

- Use Next.js `Image` component and Vercel's image CDN for optimized images.
- Pre-render public pages using SSG where possible and use ISR for CMS-driven content.
- Generate `sitemap.xml` and `robots.txt` at build time.
- Add JSON-LD structured data for the person and projects.

## Observability & Monitoring

- Google Analytics 4 (frontend) for visitor metrics.
- Sentry for frontend and serverless error tracking.
- Uptime monitoring (UptimeRobot or similar).

## CI / CD

- GitHub repository with branch protection rules.
- GitHub Actions (optional) to run linting, tests, and builds on PRs.
- Vercel to run production builds and deploy on merge to `main`.

## Extensibility

- Add an admin interface via the CMS or integrate `NextAuth` + a small admin UI when needed.
- Add integrations (Mailchimp, Zapier) using serverless endpoints or automation when required.

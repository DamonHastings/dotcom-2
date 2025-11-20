# Repository & Hosting

This document explains the repository layout, branch strategy, and hosting recommendations.

## Repository Layout

- `docs/` — project documentation and planning artifacts.
- `public/` — static assets (images, social cards).
- `src/` — application source code (pages, components, styles).
- `package.json` — scripts and dependencies.

## Branch Strategy

- `main` — production branch; auto-deploys to production.
- `develop` — staging; used for integration and preview deploys.
- `feat/<name>` — feature branches off `develop`.

## Pull Requests

- Create a PR from `feat/*` into `develop` for review.
- Ensure CI passes (lint, tests, build) before merging.
- Use the PR template and reference related issues.

## Hosting

- Recommended: Vercel for Next.js apps. Configure `preview` and `production` environment variables in the Vercel dashboard.
- Alternative: Netlify or AWS Amplify.

## Domain

- Add your custom domain in Vercel and configure DNS records (`A`/`CNAME`) per provider instructions.

## Environment Variables

- Store secrets in Vercel environment sections (Preview/Production) and never commit them to the repo.

## CI/CD Checklist

- Linting and unit tests run on PRs.
- Build step verifies no build-time errors.
- Preview deployments available for `develop` and PRs.

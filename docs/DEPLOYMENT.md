# Deployment & CI/CD

This document outlines recommended deployment practices, environment management, and a checklist for launch.

## Hosting Recommendation

- Vercel: native Next.js support, automatic builds, preview deployments, environment variables, and a global CDN.
- Alternatives: Netlify or AWS Amplify if you prefer those toolchains.

## Branching & Deploy Workflow

- Branches:

  - `main` — production (auto-deployed)
  - `develop` — staging preview
  - `feat/*` — feature branches

- Workflow:
  1. Create feature branch `feat/<name>` from `develop`.
  2. Open PR into `develop` for review; CI runs lint/tests.
  3. Merge to `develop` — staging preview deploys.
  4. When ready, open PR from `develop` to `main` and merge — production deploys.

## Environment Variables

- Manage environment variables in Vercel project settings for `development`, `preview`, and `production`.
- Important variables:
  - `NEXT_PUBLIC_SITE_URL`
  - `SENDGRID_API_KEY`
  - `MONGODB_URI`
  - `RECAPTCHA_SECRET`
  - `SANITY_API_TOKEN` (if using Sanity)

## CI / GitHub Actions (optional)

- Example steps for CI on PRs:
  - Checkout
  - Install dependencies (`pnpm install`)
  - Run `pnpm lint`
  - Run `pnpm test`
  - Build (`pnpm build`) to verify no build-time errors

## Secrets Management & Security

- Use Vercel for production secrets; never store keys in the repo.
- Rotate keys periodically and restrict SendGrid templates to required origins.

## Launch Checklist

- Confirm all production environment variables are set in Vercel.
- Confirm domain DNS points to Vercel and SSL is enabled.
- Run final accessibility and performance audits (Lighthouse).
- Verify contact form is working end-to-end in production.
- Verify analytics and Sentry (if enabled) are receiving data.

## Rollback Plan

- Use Vercel's deployment history to rollback to the previous stable deployment if needed.
- If issues are persistent, revert the merge commit on GitHub and re-deploy.

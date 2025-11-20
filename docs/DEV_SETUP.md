# Development Environment & Setup

This document describes steps to get the project running locally and the recommended developer tools and scripts.

## Prerequisites

- Node.js (LTS, e.g., 18+)
- `pnpm` or `npm` (`pnpm` recommended)
- Git
- (Optional) Docker for running MongoDB locally
- Accounts: GitHub, Vercel, MongoDB Atlas, SendGrid, chosen CMS (Sanity/Contentful)

## Clone & Install

```bash
git clone git@github.com:<username>/<repo>.git
cd <repo>
pnpm install
```

## Environment Variables

- Copy example and set local secrets:

```bash
cp .env.example .env.local
# Edit .env.local and set values:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
# MONGODB_URI=mongodb://localhost:27017/portfolio
# SENDGRID_API_KEY=...
# SANITY_PROJECT_ID=... (if using Sanity)
# RECAPTCHA_SECRET=...
```

## Scripts

- `pnpm dev` — run Next.js dev server
- `pnpm build` — build production assets
- `pnpm start` — run production server locally
- `pnpm lint` — run ESLint
- `pnpm test` — run unit tests
- `pnpm format` — run Prettier

## Running Locally

1. Start MongoDB locally (if not using Atlas):

```bash
# Option A: Docker
docker run -p 27017:27017 -d --name local-mongo mongo:6

# Option B: Homebrew (macOS)
brew services start mongodb-community
```

2. Start dev server:

```bash
pnpm dev
# open http://localhost:3000
```

## Code Quality

- ESLint config enforces TypeScript rules and React best practices.
- Pre-commit hooks (Husky) to run `pnpm lint` and `pnpm test` before commit.

## Local CMS (if using Sanity)

- Install and run Sanity Studio locally for content editing:

```bash
npm install -g @sanity/cli
cd cms
sanity start
```

## Notes

- Keep `.env.local` out of source control. Add `.env*` to `.gitignore`.
- Use `pnpm` for deterministic installs and workspace performance.

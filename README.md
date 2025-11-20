# Portfolio Website

This repository contains the source and documentation for a personal portfolio website. The site is built with Next.js, TypeScript, and Tailwind CSS (recommended), and is intended to showcase projects, skills, and contact information.

See `/docs` for project planning, technical design, and workflow documentation.

## Quick start

1. Copy `.env.example` to `.env.local` and fill environment variables.
2. Install dependencies: `pnpm install`
3. Run dev server: `pnpm dev`

## Contributing

Please follow the branch strategy described in `docs/REPO_HOSTING.md` and create pull requests for changes.

## Deployment

This project is configured to deploy to Vercel. See `docs/DEPLOYMENT_VERCEL.md` for detailed instructions on connecting the repository, required environment variables, and using the Vercel CLI.

There is an optional GitHub Action at `.github/workflows/deploy-vercel.yml` that can trigger manual deployments to Vercel. If you prefer Vercel's native GitHub integration (recommended), import the repo in Vercel and use preview/prod deployments automatically.

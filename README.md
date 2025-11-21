# Portfolio Website

This repository contains the source and documentation for a personal portfolio website. The site is built with Next.js, TypeScript, and Tailwind CSS (recommended), and is intended to showcase projects, skills, and contact information.

See `/docs` for project planning, technical design, and workflow documentation.

## Quick start

1. Copy `.env.example` to `.env.local` and fill environment variables.
2. Install dependencies with pnpm: `pnpm install`
3. Run dev server: `pnpm dev`
4. (Optional) Open Sanity Studio at `http://localhost:3000/studio` after setting env vars.
5. Only use `pnpm`. Avoid mixing `npm` or `yarn` to prevent lockfile conflicts.

## Sanity CMS

This project uses an embedded Sanity Studio (Next.js route) for managing project content.

### Setup

1. Create a Sanity project at https://www.sanity.io/create if you don't have one.
2. Copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` (e.g. `production`)
   - `SANITY_WRITE_TOKEN` (optional – needed only for mutations from server code)
3. Start dev server: `pnpm dev` and visit `/studio`.

### Adding Content

Use the Studio UI to create `Project` documents. Fields:

- Title (required)
- Subtitle
- Slug (auto-generated from title)
- Description
- Status (draft/published)
- Order (number used for manual sorting)
- Cover Image (hotspot enabled)

### Querying Content

Example fetching in code (`src/lib/sanity.ts`):

```ts
import { fetchProjects } from '@/lib/sanity';
const projects = await fetchProjects();
```

### Deployment Notes

Expose the same env vars in production (e.g. Vercel project settings). The embedded Studio can be protected with authentication or role-based access by configuring Sanity's dataset permissions. For public sites, consider disabling the Studio route in production or gating it behind authentication.

### Customization

Add more schemas under `src/sanity/schema` and include them in `sanity.config.ts`.

If you prefer a standalone studio, you can generate one with `pnpm dlx sanity@latest init` in a separate folder; this repository opts for the embedded approach for simpler deployment.

### Package Manager Policy

This repo standardizes on pnpm:

- Lockfile: `pnpm-lock.yaml` (commit this; do not add a `package-lock.json` or `yarn.lock`).
- Use `pnpm add <pkg>` / `pnpm add -D <pkg>` for dependencies.
- For one-off executables, prefer `pnpm dlx <package>` instead of `npx`.
- If switching branches with differing deps, run `pnpm install` again rather than `npm install`.

To repair a mixed install state:

```bash
rm -rf node_modules
pnpm install
```

## Contributing

Please follow the branch strategy described in `docs/REPO_HOSTING.md` and create pull requests for changes.

## Deployment

This project is configured to deploy to Vercel. See `docs/DEPLOYMENT_VERCEL.md` for detailed instructions on connecting the repository, required environment variables, and using the Vercel CLI.

There is an optional GitHub Action at `.github/workflows/deploy-vercel.yml` that can trigger manual deployments to Vercel. If you prefer Vercel's native GitHub integration (recommended), import the repo in Vercel and use preview/prod deployments automatically.

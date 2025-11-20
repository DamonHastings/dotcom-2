# Feature: Bootstrap Scaffold

This feature bootstraps the project with a minimal Next.js + TypeScript + Tailwind CSS skeleton. It is committed under `feat/bootstrap` and includes the following:

- `package.json` with scripts to run, build, and lint
- TypeScript config: `tsconfig.json`
- Next config: `next.config.js`
- Tailwind and PostCSS config: `tailwind.config.js`, `postcss.config.js`
- Basic ESLint and Prettier configs
- `.env.example` listing environment variables
- `src/pages/*` — minimal pages: `index`, `about`, `skills`, `projects` and dynamic project page
- `src/pages/api/contact.ts` — contact API stub
- `src/components/Layout` and `src/components/Button` — basic components
- `src/styles/globals.css` — Tailwind base imports

How to run
----------
Install dependencies and run dev:

```bash
pnpm install
pnpm dev
```

Notes
-----
- This scaffold is intentionally minimal to provide a stable foundation. Next steps:
  - Add Tailwind tokens and theme config
  - Implement the contact API with reCAPTCHA and SendGrid
  - Add tests and CI config

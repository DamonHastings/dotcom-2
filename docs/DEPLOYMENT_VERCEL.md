**Vercel Deployment Guide**

- **Purpose:** Steps to connect this repository to Vercel, configure environment variables, and enable automatic deployments. Use this document to set up production and preview deployments.

- **Prerequisites:**
  - A Vercel account (https://vercel.com).
  - GitHub repository connected to this project.

1. Connect the repo to Vercel (recommended)

- Log in to Vercel and choose "Import Project" → select your GitHub repository.
- Vercel will auto-detect Next.js and configure the build settings. Default build command and settings work with Next.js.

2. Environment variables (set these in the Vercel dashboard under Project → Settings → Environment Variables):

- `SENDGRID_API_KEY` — API key for transactional email (if used).
- `MONGODB_URI` — connection string for message persistence (optional).
- `RECAPTCHA_SECRET` — server-side secret for reCAPTCHA verification.
- `NEXT_PUBLIC_GA_ID` — optional Google Analytics measurement ID (public env var).

3. Build & Output

- Vercel auto-detects Next.js. The framework preset will run `npm run build` (or `pnpm build` if you configure that) and deploy the app.

4. Preview & Production Deploys

- Pushes to branches create preview deployments automatically.
- Merges to the production branch (e.g., `main`) create production deployments.

5. Using the Vercel CLI (optional)

- Install: `npm i -g vercel`
- Link local project: `vercel link`
- Deploy manually: `vercel --prod`

6. GitHub Actions (optional automated deployment)

- This repo includes a workflow `.github/workflows/deploy-vercel.yml` that can trigger a deploy using a Vercel token.
- To enable it, add these GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

7. Creating a Vercel token

- In Vercel dashboard: Settings → Tokens → Create Token. Copy its value to `VERCEL_TOKEN` in GitHub Secrets.

8. Notes & recommendations

- Recommended: Use the Vercel GitHub integration for the simplest preview/prod flow. The GitHub Action is optional and useful when you want explicit control from CI.
- Keep production secrets only in Vercel (or sync from a secure secret manager).
- If you use SendGrid/MongoDB, ensure network access (IP allowlists) and test in preview before production.

Reference: `vercel.json` config is present at the repo root to provide explicit build/runtime settings.

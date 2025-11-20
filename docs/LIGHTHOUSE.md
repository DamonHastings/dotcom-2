# Lighthouse Audits

This document explains how Lighthouse audits are run in CI and how to run them locally during development.

## CI

- A GitHub Actions workflow at `.github/workflows/lighthouse.yml` runs on pushes to `main` and `develop`, and on pull requests.
- The workflow builds the app, starts a local server, and uses `treosh/lighthouse-ci-action` to run Lighthouse against `http://localhost:3000` and upload artifacts.
- The workflow enforces threshold gates; if your score falls below the thresholds the job will fail.

## Run Lighthouse locally

1. Build and start the app locally:

```bash
npm ci
npm run build
npm run start
# in another terminal run:
npx wait-on http://localhost:3000
```

2. Run Lighthouse from the CLI (requires Chrome installed):

```bash
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html --preset=desktop
```

3. Open `lighthouse-report.html` in your browser to review results.

## Using the Chrome DevTools

- Open `http://localhost:3000`, open DevTools > Lighthouse, and run the audit (desktop or mobile presets).

## Useful thresholds (suggested for MVP)

- Performance: 90
- Accessibility: 90
- Best Practices: 90
- SEO: 90

If CI fails due to temporary network issues (external images or third-party scripts), re-run the workflow after investigating the external dependency.

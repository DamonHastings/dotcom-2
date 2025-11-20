# Contributing

Thank you for contributing! This file explains how to set up the project locally, run tests, and create well-formed pull requests.

## Getting started

1. Fork the repository and clone your fork.
2. Create a feature branch named `feat/<short-description>` from `develop`.
3. Run the project locally (see `docs/DEV_SETUP.md`).

## Code style

- Use `pnpm` for package management.
- Run `pnpm lint` and `pnpm format` before committing.

## Commit messages

- Use concise commit messages. Recommended prefix formats:
  - `feat:` — new feature
  - `fix:` — bug fix
  - `docs:` — documentation changes

## Pull requests

- Open a PR from your feature branch into `develop`.
- Include a short summary, link to related issues, and screenshots if UI changed.
- Ensure CI passes (lint, tests, build).

## Testing

- Unit tests: `pnpm test`
- E2E tests: `pnpm e2e` (if configured)

## Pre-commit hooks

- Husky will run lint/tests before commit (if configured).

## Security

- Do not commit secrets or `.env` files. Use environment variables for keys.

# Updating the Landing Page schema (hero tagline & intro summary)

This project now uses Portable Text for the `heroTagline` and `summary` fields on the `landingPage` document so those fields can be edited with a WYSIWYG editor in Sanity Studio.

What changed

- `heroTagline` and `summary` fields are now `type: 'array', of: [{ type: 'block' }]` in `src/sanity/schema/landingPage.ts`.

View the Studio locally

1. Start your Next.js dev server (Studio is mounted at `/studio`):

```bash
pnpm dev
# then open http://localhost:3000/studio
```

2. Visit `/studio` and open the `Landing Page` document to edit the rich text fields.

Migration (optional)

If you already have a `landingPage` document where `heroTagline` or `summary` are plain strings, you can convert them to a single-block Portable Text array using the included migration script.

Run a dry-run first (it will only print planned changes):

```bash
node scripts/migrate-landing-strings-to-blocks.mjs
```

To apply changes, provide a write token and `--yes`:

```bash
SANITY_WRITE_TOKEN="<your-write-token>" \
NEXT_PUBLIC_SANITY_PROJECT_ID="<your-project-id>" \
NEXT_PUBLIC_SANITY_DATASET="production" \
  node scripts/migrate-landing-strings-to-blocks.mjs --yes
```

Notes

- The script is a simple one-off migration helper. Keep it for reproducibility or remove it after running.
- Because this Studio is mounted inside the Next app (`/studio`), deploying the Next app with the updated code is enough to make the Studio changes live. If you host a standalone Sanity Studio separately, follow your usual Studio deployment steps (e.g., `sanity deploy` in that studio repo).

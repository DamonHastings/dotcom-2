# Sanity Content Strategy — Flexible, Section-Based Pages

This document describes a new content model for the studio that favors flexibility and reusability. The goal is to let content editors assemble pages from modular sections (hero, rich text, two-column, etc.) and ensure the front-end can render these predictably.

## Goals

- Make pages composable: editors can add, reorder, and remove sections.
- Reduce one-off page types by using a single `flexiblePage` document type for most marketing/content pages.
- Reuse smaller object types (e.g., `cta`) across sections and pages.
- Keep Portable Text (Sanity blocks) for WYSIWYG editing where needed.
- Provide clear front-end consumption patterns and sample GROQ queries.

## New schema overview

Files added:

- `src/sanity/schema/cta.ts` — object type for CTAs (label, href, variant, openInNewTab)
- `src/sanity/schema/sectionHero.ts` — `heroSection` object
- `src/sanity/schema/sectionRichText.ts` — `richTextSection` object
- `src/sanity/schema/sectionTwoColumn.ts` — `twoColumnSection` object
- `src/sanity/schema/flexiblePage.ts` — `flexiblePage` document that composes sections

These are registered in `src/sanity/schemaTypes/index.ts`.

## Section types

- `heroSection` — title, eyebrow, subtitle, background image, and CTAs.
- `richTextSection` — heading, `content` (Portable Text `block` array), optional CTAs.
- `twoColumnSection` — `left` and `right` columns (each portable text or image), optional CTAs.

CTAs are an array of the `cta` object and used consistently across sections.

## Front-end consumption

A recommended GROQ query to fetch a flexible page by slug:

```groq
*[_type == "flexiblePage" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  metaTitle,
  metaDescription,
  hero,
  sections[]{
    _type,
    ..., // preserves section fields
  }
}
```

Front-end strategy:

- Map section `_type` values to React components: `heroSection` -> `HeroSection`, `richTextSection` -> `RichTextSection`, etc.
- Each component knows how to render the fields in the corresponding object type (Portable Text -> `@portabletext/react`).
- Keep Portable Text rendering consistent by using a centralized renderer (`src/lib/portableTextComponents.tsx`) so marks and block styles are uniform across sections.

## Migration notes

- Existing `learnMore` documents can continue to be used. You can gradually migrate content by creating a `flexiblePage` and copying content over from `learnMore` (or update the seed script to create a sample `flexiblePage`).
- For simple pages, a single `richTextSection` with the `content` from `learnMore` is a direct mapping.

## Example: map `learnMore` -> `flexiblePage`

1. Create a new `flexiblePage`.
2. Set `hero.title` to the `learnMore.title` (or keep separate).
3. Add a `richTextSection` to `sections` and copy `learnMore.content` into the `content` field.
4. Copy `ctas` if present.

## Best practices for editors

- Use `hero` for above-the-fold content with a primary CTA.
- Use `richTextSection` for long-form content where editors need WYSIWYG control.
- Use `twoColumnSection` for side-by-side visuals and copy.
- Reuse CTAs to keep consistent labels and variants.

## Notes for developers

- The front-end must safely handle unknown section types (render a fallback) — this enables iterative schema evolution without runtime crashes.
- Use `getStaticProps` (Next.js) with a consistent GROQ query and map sections to components at render time.

---

If you'd like, I can:

- Create a sample `flexiblePage` seed script and run it (requires `SANITY_WRITE_TOKEN`).
- Update the `LearnMorePage` component to support rendering `flexiblePage` sections directly.
- Add previews or a Studio desk structure entry for `flexiblePage` singletons.

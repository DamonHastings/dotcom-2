Sanity Content Strategy
Create a content strategy for a personal dotcom site using Sanity.io as the CMS. The site should include the following pages:

1. Home Page
2. About Me Page
3. Blog Page
4. Projects Page
5. Contact Page

Content Strategy for Personal Dotcom Site using Sanity.io

1. Home Page
   - Hero Section: A brief introduction with a professional photo and tagline.
   - Featured Content: Highlights of recent blog posts, projects, or achievements.
   - Call to Action: Links to About Me, Blog, Projects, and Contact pages.
   - Testimonials: Quotes from colleagues or clients.
   - Footer: Social media links, newsletter signup, and copyright information.
2. About Me Page
   - Personal Bio: A detailed biography including background, education, and career journey.
   - Skills & Expertise: A list of technical skills, tools, and technologies.
   - Achievements: Awards, recognitions, and notable accomplishments.
   - Resume Download: A link to download the resume in PDF format.
   - Call to Action: Links to Projects and Contact pages.
3. Blog Page
   - Blog Listing: A list of blog posts with titles, excerpts, and publication dates.
   - Categories & Tags: Filters to sort blog posts by categories and tags.
   - Search Functionality: A search bar to find specific blog posts.
   - Individual Blog Post Template: Title, author, publication date, content (rich text), images, and related posts.
   - Call to Action: Links to About Me, Projects, and Contact pages.
4. Projects Page
   - Project Listing: A grid or list of projects with titles, short descriptions, and thumbnail images.
   - Project Details Template: Title, description, technologies used, images/screenshots, links to live projects or repositories, and challenges faced.
   - Call to Action: Links to About Me, Blog, and Contact pages.
5. Contact Page
   - Contact Form: Fields for name, email, subject, and message.
   - Contact Information: Email address, phone number, and social media links.
   - Map Integration: An embedded map showing location (optional).
   - Call to Action: Links to About Me, Blog, and Projects pages.

Schema Design in Sanity.io

1. Document Types
   - homePage
   - aboutMePage
   - blogPost
   - project
   - contactPage
2. Object Types
   - heroSection
   - featuredContent
   - callToAction
   - testimonial
   - personalBio
   - skillsExpertise
   - achievement
   - blogListing
   - projectListing
   - contactForm
3. Fields
   - Text: title, subtitle, tagline, name, email, subject, message
   - Rich Text: biography, blog content, project description
   - Image: professional photo, project thumbnails, blog images
   - Array: skills, achievements, blog posts, projects, testimonials
   - Reference: links to related documents (e.g., blog posts, projects)
     Implementation Notes

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

````jsx<LearnMorePage
  imageSrc="/profile.jpg"
  imageAlt="Me"
  title="About Me"
  content={content}
  ctas={[
    { label: 'Resume', href: '/resume.pdf', variant: 'secondary' },
    { label: 'Products', href: '/products', variant: 'primary' },
    { label: 'Contact', href: '/contact', variant: 'ghost' },
   ]}
/>```

```jsx
<LearnMorePage
  imageSrc="/profile.jpg"
  imageAlt="Me"
  title="About Me"
  content={content}
  ctas={[
    { label: 'Resume', href: '/resume.pdf', variant: 'secondary' },
    { label: 'Products', href: '/products', variant: 'primary' },
    { label: 'Contact', href: '/contact', variant: 'ghost' },
  ]}
/>
```1. Create a new `flexiblePage`.
2. Set `hero.title` to the `learnMore.title` (or keep separate).
3. Add a `richTextSection` to `sections` and copy `learnMore.content` into the `content` field.
4. Copy `ctas` if present.
## Best practices for editors
- Use `hero` for above-the-fold content with a primary CTA.
- Structure content in `sections` for modularity and reusability.
- Leverage Portable Text for rich content areas, ensuring consistent styling via the centralized renderer.
- Preview changes in the front-end to ensure proper rendering of sections and CTAs.


````

import { defineType, defineField } from 'sanity';

// Singleton landing page schema for home content composition.
export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading Lines',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.min(1).max(5),
      description: 'Each string renders as a separate line in the hero heading.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      description: 'Optional image displayed in the hero area. Use alt text for accessibility.',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Intro Summary',
      type: 'text',
    }),
    defineField({
      name: 'primaryCtas',
      title: 'Primary CTAs',
      type: 'array',
      of: [
        defineType({
          name: 'landingPrimaryCta',
          title: 'Primary CTA',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', type: 'string', validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'secondaryCtas',
      title: 'Secondary CTAs',
      type: 'array',
      of: [
        defineType({
          name: 'landingSecondaryCta',
          title: 'Secondary CTA',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', type: 'string', validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
    }),
  ],
});

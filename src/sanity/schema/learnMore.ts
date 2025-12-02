import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'learnMore',
  title: 'Learn More Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'imageAlt', title: 'Image alt text', type: 'string' }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{ type: 'cta' }],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', media: 'image' },
    prepare(selection) {
      const sel = selection as Record<string, unknown>;
      const title = sel.title as string | undefined;
      const slug = sel.slug as string | undefined;
      return {
        title: title || 'Learn More',
        subtitle: slug ? `/${slug}` : '/learn-more',
      };
    },
  },
});

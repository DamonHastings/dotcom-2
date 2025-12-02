import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text' }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'imageAlt', title: 'Image alt text', type: 'string' }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{ type: 'cta' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'backgroundImage' },
    prepare(selection) {
      const sel = selection as Record<string, unknown>;
      const title = sel.title as string | undefined;
      const subtitle = sel.subtitle as string | undefined;
      return { title: title || 'Hero', subtitle };
    },
  },
});

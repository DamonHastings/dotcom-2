import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'flexiblePage',
  title: 'Flexible Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text' }),
    defineField({ name: 'hero', title: 'Hero', type: 'heroSection' }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{ type: 'heroSection' }, { type: 'richTextSection' }, { type: 'twoColumnSection' }],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'hero.backgroundImage' },
  },
});

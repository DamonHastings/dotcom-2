import { defineType, defineField } from 'sanity';
import type { ReactNode } from 'react';

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      description: 'Rich text content using Portable Text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'experiences',
      title: 'Related Experiences',
      type: 'array',
      of: [
        defineField({
          name: 'experienceRef',
          title: 'Experience',
          type: 'reference',
          to: [{ type: 'experience' }],
        }),
      ],
      description: 'Associate blog posts with relevant professional experiences',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      date: 'publishedAt',
    },
    prepare(selection) {
      const { title, media, date } = selection as {
        title?: string;
        media?: ReactNode;
        date?: string;
      };
      return {
        title: title ?? 'Untitled',
        media,
        subtitle: date ? new Date(date).toLocaleDateString() : undefined,
      };
    },
  },
});

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'blogListing',
  title: 'Blog Listing',
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
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Optional rich intro text for the listing page',
    }),
    defineField({
      name: 'featuredPosts',
      title: 'Featured Posts',
      type: 'array',
      of: [
        defineField({
          name: 'postRef',
          title: 'Post',
          type: 'reference',
          to: [{ type: 'blogPost' }],
        }),
      ],
      description: 'Curated posts to feature at the top',
    }),
    defineField({
      name: 'defaultTagFilters',
      title: 'Default Tag Filters',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional default tags to filter posts on this listing',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
    prepare(selection) {
      const { title, media } = selection as { title?: string; media?: unknown };
      return {
        title: title ?? 'Blog Listing',
        media,
      };
    },
  },
});

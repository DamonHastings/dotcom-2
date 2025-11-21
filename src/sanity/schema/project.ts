import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'subtitle', type: 'string' }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'status', type: 'string', options: { list: ['draft', 'published'] } }),
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
  ],
});

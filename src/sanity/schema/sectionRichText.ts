import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'richTextSection',
  title: 'Rich Text Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{ type: 'cta' }],
      options: { layout: 'grid' },
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare(selection) {
      const { title } = selection as any;
      return { title: title || 'Rich text' };
    },
  },
});

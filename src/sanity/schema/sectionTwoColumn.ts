import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'twoColumnSection',
  title: 'Two Column Section',
  type: 'object',
  fields: [
    defineField({
      name: 'left',
      title: 'Left column',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({
      name: 'right',
      title: 'Right column',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({ name: 'reverse', title: 'Reverse columns', type: 'boolean' }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{ type: 'cta' }],
      options: { layout: 'grid' },
    }),
  ],
  preview: {
    select: { title: 'left[0].children[0].text' },
    prepare(selection) {
      const { title } = selection as any;
      return { title: title ? `${String(title).slice(0, 40)}…` : 'Two column' };
    },
  },
});

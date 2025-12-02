import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'href', title: 'Href', type: 'url' }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Ghost', value: 'ghost' },
        ],
      },
    }),
    defineField({ name: 'openInNewTab', title: 'Open in new tab', type: 'boolean' }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
    prepare(selection) {
      const sel = selection as Record<string, unknown>;
      const title = sel.title as string | undefined;
      const subtitle = sel.subtitle as string | undefined;
      return { title: title || 'CTA', subtitle };
    },
  },
});

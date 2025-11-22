import { defineType, defineField } from 'sanity';

// Document representing a professional experience or role
export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'date' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'date' }),
    defineField({
      name: 'duration',
      title: 'Duration (display)',
      type: 'string',
      description: 'Optional human-friendly duration like "4.5 years"',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Short paragraph describing the role and impact',
    }),
    defineField({
      name: 'story',
      title: 'Story',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Long-form narrative; supports rich text (portable text) for WYSIWYG editing',
    }),
    defineField({
      name: 'resume',
      title: 'Resume View',
      type: 'object',
      fields: [
        defineField({ name: 'shortSummary', title: 'Short summary', type: 'text' }),
        defineField({
          name: 'bullets',
          title: 'Bulleted items',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
      description: 'Structured resume-style view: short summary followed by bullets',
    }),
    defineField({
      name: 'responsibilities',
      title: 'Responsibilities / Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short bullets summarizing key responsibilities or achievements',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies / Skills Used',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'List of technologies, tools, or skills used in this role (e.g. React, Node, AWS)',
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Link to company or case study',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers sort first',
    }),
  ],
});

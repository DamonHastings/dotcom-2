import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteInfo',
  title: 'Site Info',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Your Name / Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Short professional overview for the landing/about pages.',
    }),
    defineField({
      name: 'resume',
      title: 'Resume (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        defineType({
          name: 'service',
          title: 'Service',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', type: 'text' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        defineType({
          name: 'skill',
          title: 'Skill',
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'category', type: 'string' }),
            defineField({
              name: 'level',
              type: 'string',
              description: 'e.g. Expert, Advanced, Intermediate',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'array',
      of: [
        defineType({
          name: 'socialLink',
          title: 'Social Link',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'GitHub', value: 'github' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Dribbble', value: 'dribbble' },
                  { title: 'Instagram', value: 'instagram' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Optional ordering if multiple siteInfo docs exist (usually only one).',
    }),
  ],
});

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'featureFlag',
  title: 'Feature Flag',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Flag Key',
      type: 'string',
      description: 'Unique identifier for the feature flag (e.g. new-navbar).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short description of what the flag controls.',
    }),
    defineField({
      name: 'rollout',
      title: 'Rollout Percentage',
      type: 'number',
      description: 'Optional percentage rollout for gradual releases (0–100).',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'environments',
      title: 'Environments',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Optional list of environments (e.g. development, staging, production).',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Optional ordering for display in lists.',
    }),
  ],
});

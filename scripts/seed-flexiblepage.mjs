import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load .env.local explicitly so scripts pick up local dev vars
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2023-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN is required to run this script.');
    process.exit(1);
  }

  const doc = {
    _id: 'flexible_home',
    _type: 'flexiblePage',
    title: 'Home (Flexible)',
    slug: { _type: 'slug', current: 'home' },
    metaTitle: 'Home — Example',
    metaDescription: 'Seeded flexible page for development',
    hero: {
      _type: 'heroSection',
      eyebrow: 'Hi there',
      title: "I'm a product-focused frontend engineer",
      subtitle: 'I build accessible, high-performance web applications.',
      ctas: [
        { _type: 'cta', label: 'Contact', href: '/contact', variant: 'primary' },
        { _type: 'cta', label: 'Projects', href: '/projects', variant: 'secondary' },
      ],
    },
    sections: [
      {
        _type: 'richTextSection',
        heading: 'About me',
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'I craft delightful, accessible user interfaces and design systems.',
              },
            ],
          },
        ],
        ctas: [
          {
            _type: 'cta',
            label: 'Resume',
            href: '/resume.pdf',
            variant: 'primary',
            openInNewTab: true,
          },
        ],
      },
      {
        _type: 'twoColumnSection',
        left: [
          {
            _type: 'block',
            children: [
              { _type: 'span', text: 'Left column content: a short intro and highlights.' },
            ],
          },
        ],
        right: [
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Right column content: links, stats, or an image.' }],
          },
        ],
        ctas: [{ _type: 'cta', label: 'Get in touch', href: '/contact', variant: 'secondary' }],
      },
    ],
  };

  try {
    const res = await client.createOrReplace(doc);
    console.log('Created/Updated flexiblePage document:', res._id);
    console.log('You can edit it in the Studio now.');
  } catch (err) {
    console.error('Error creating flexiblePage document:', err);
    process.exit(1);
  }
}

run();

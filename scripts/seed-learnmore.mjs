import sanityClient from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-21',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN is required to run this script.');
    process.exit(1);
  }

  const doc = {
    _id: 'learnMorePage',
    _type: 'learnMore',
    title: 'About Me',
    slug: { _type: 'slug', current: 'learn-more' },
    imageAlt: 'Profile',
    ctas: [
      {
        _type: 'cta',
        label: 'Resume',
        href: '/resume.pdf',
        variant: 'primary',
        openInNewTab: true,
      },
      { _type: 'cta', label: 'Contact', href: '/contact', variant: 'secondary' },
      { _type: 'cta', label: 'Products', href: '/products', variant: 'ghost' },
    ],
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: "Hi — I'm a product-focused frontend engineer who cares about design systems and performance.",
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'I enjoy building accessible interfaces and shipping delightful micro-interactions.',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          { _type: 'span', text: 'Contact me via the site or follow along on social media.' },
        ],
      },
    ],
  };

  try {
    const res = await client.createOrReplace(doc);
    console.log('Created/Updated learnMore document:', res._id);
    console.log('You can edit it in the Studio now.');
  } catch (err) {
    console.error('Error creating learnMore document:', err);
    process.exit(1);
  }
}

run();

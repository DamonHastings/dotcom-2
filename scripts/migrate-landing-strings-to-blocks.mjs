#!/usr/bin/env node
/*
  One-time migration script to convert `heroTagline` and `summary` string fields
  on the `landingPage` document into Portable Text (array of blocks).

  Usage:
    SANITY_WRITE_TOKEN="<token>" NEXT_PUBLIC_SANITY_PROJECT_ID="<id>" NEXT_PUBLIC_SANITY_DATASET="production" \
      node scripts/migrate-landing-strings-to-blocks.mjs --yes

  Without `--yes` the script will only print planned changes.
*/

import sanityClient from '@sanity/client';

const args = process.argv.slice(2);
const doRun = args.includes('--yes');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN || process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID');
  process.exit(1);
}
if (!token && doRun) {
  console.error('Missing SANITY_WRITE_TOKEN; required to perform the migration');
  process.exit(1);
}

const client = sanityClient({ projectId, dataset, apiVersion: '2024-01-01', token });

function toBlock(text) {
  if (text == null) return null;
  return [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: String(text),
        },
      ],
    },
  ];
}

async function run() {
  try {
    const landing = await client.fetch(`*[_type == "landingPage"][0]{_id, heroTagline, summary}`);
    if (!landing) {
      console.log('No landingPage document found. Nothing to do.');
      return;
    }

    const patches = {};
    if (typeof landing.heroTagline === 'string') patches.heroTagline = toBlock(landing.heroTagline);
    if (typeof landing.summary === 'string') patches.summary = toBlock(landing.summary);

    if (Object.keys(patches).length === 0) {
      console.log('No string fields detected on landingPage; nothing to migrate.');
      return;
    }

    console.log('Planned patches for landingPage:', patches);

    if (!doRun) {
      console.log(
        '\nDry run. To apply these changes, re-run with --yes and provide SANITY_WRITE_TOKEN in env.'
      );
      return;
    }

    const result = await client
      .patch(landing._id)
      .set(patches)
      .commit({ autoGenerateArrayKeys: true });
    console.log('Migration committed. Document id:', result._id);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();

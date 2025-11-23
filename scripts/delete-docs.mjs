#!/usr/bin/env node
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2023-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

function parseArg(name) {
  // Support both `--name=value` and `--name value` forms.
  for (let i = 2; i < process.argv.length; i += 1) {
    const a = process.argv[i];
    if (a === `--${name}` && i + 1 < process.argv.length) {
      return process.argv[i + 1];
    }
    if (a.startsWith(`--${name}=`)) {
      return a.split('=')[1];
    }
  }
  return null;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`) || process.argv.includes(`-${name}`);
}

async function run() {
  const rawQuery = parseArg('query');
  const type = parseArg('type');
  const filter = parseArg('filter');
  const yes = hasFlag('yes');

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error(
      'SANITY_WRITE_TOKEN is required to delete documents. Set it in .env.local or export in your shell.'
    );
    process.exit(1);
  }

  let query;
  if (rawQuery) {
    query = rawQuery;
  } else if (type) {
    // filter should be a GROQ fragment like `company == "Vouch Insurance"`
    query = `*[_type == "${type}"${
      filter ? ' && ' + filter : ''
    }]{_id, _type, title, company, role}`;
  } else {
    console.error('Provide either --query="<GROQ>" or --type=<type> [--filter="<GROQ fragment>"]');
    process.exit(1);
  }

  console.log('Running query:', query);
  const docs = await client.fetch(query);

  if (!docs || docs.length === 0) {
    console.log('No documents matched the query. Nothing to delete.');
    process.exit(0);
  }

  console.log(`Found ${docs.length} document(s):`);
  docs.forEach((d, i) => {
    console.log(
      `${i + 1}. id=${d._id} type=${d._type} ${d.title ? 'title=' + d.title : ''} ${
        d.company ? 'company=' + d.company : ''
      }`
    );
  });

  if (!yes) {
    console.log(
      '\nDry run — no documents deleted. To delete these documents, re-run with the --yes flag.'
    );
    console.log(
      'Example: node scripts/delete-docs.mjs --type=experience --filter="company == "Vouch Insurance"" --yes'
    );
    process.exit(0);
  }

  // Delete sequentially to avoid bursting the API
  for (const d of docs) {
    try {
      await client.delete(d._id);
      console.log('Deleted', d._id);
    } catch (err) {
      console.error('Failed to delete', d._id, err.message || err);
    }
  }

  console.log('Delete operation complete.');
}

run().catch((err) => {
  console.error('Error running delete script:', err);
  process.exit(1);
});

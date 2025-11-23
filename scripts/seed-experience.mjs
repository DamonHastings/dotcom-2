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

// Resume data (extracted) — update or replace as needed
const resume = {
  id: '1762311399548',
  name: 'Damon Hastings',
  title: 'Senior Full-Stack Engineer',
  experience: [
    {
      id: '62c70c45-9612-4ba9-8cc4-69c0a453a9a9',
      company: 'Vouch Insurance',
      role: 'Senior Software Engineer',
      start: '2021-02',
      end: '2025-08',
      summary:
        'Led full-stack development of core insurance experiences, modernizing frontend architecture, designing backend services, and collaborating closely with cross-functional groups to launch new product capabilities.',
      bullets: [
        'Led migration of the Quoting app to React with modern patterns, redesigning state management and reducing rendering overhead for large data-loaded workflows.',
        'Designed and implemented service-oriented backend modules to replace monolithic Rails functionality, improving iteration speed, reliability, and system observability.',
        'Built and maintained a shared component library used across engineering teams, improving development speed, UI consistency, and accessibility compliance.',
        'Partnered with Legal, Insurance Operations, and Product teams to translate complex domain rules into scalable, maintainable system logic.',
        'Improved frontend and backend performance through deep debugging, profiling, and architectural simplification.',
      ],
    },
    {
      id: '414eeeb0-f81c-42d5-a13d-10f3cc61449b',
      company: 'Parsley Health',
      role: 'Growth Engineer',
      start: '2018-08',
      end: '2019-12',
      summary:
        'Worked at the intersection of engineering, design, and marketing to build user experiences and backend integrations that improved onboarding, funnel performance, and operational workflows.',
      bullets: [],
    },
    {
      id: 'f7b52c80-2df8-4ff4-8f25-42cc230a1a5f',
      company: 'Walker & Company Brands',
      role: 'Software Engineer',
      start: '2016-02',
      end: '2018-07',
      summary:
        'Delivered user-facing e-commerce and marketing applications with a focus on performance, modularity, and system integration.',
      bullets: [
        'Partnered across Product, Growth, and Design to launch new customer pathways and data-driven features.',
      ],
    },
    {
      id: 'a7b32d41-9ef3-4a5c-9ef9-0933a22a1c6c',
      company: 'Elefint Designs',
      role: 'Front-End Developer',
      start: '2015-01',
      end: '2016-08',
      summary:
        'Built web experiences for nonprofits and social enterprises, translating complex narratives into clear, performant digital interfaces.',
      bullets: [],
    },
    {
      id: '83af9d98-9cdc-44d8-9c27-454f3095d0d7',
      company: 'AG Design',
      role: 'Contract Software Engineer & UI Designer',
      start: '2013-05',
      end: '2015-05',
      summary:
        'Delivered custom front-end systems and UI design work for small businesses and digital agencies.',
      bullets: [],
    },
    {
      id: '8f61096c-7ce6-4660-8438-ca4ee740249b',
      company: 'Gensler',
      role: 'Software Engineer',
      start: '2010-12',
      end: '2013-05',
      summary:
        'Built internal tools and dashboards supporting global architecture teams, improving workflows and information access.',
      bullets: [],
    },
  ],
};

function toISODate(yymm) {
  if (!yymm) return null;
  // Accept YYYY or YYYY-MM, return YYYY-MM-01
  if (/^\d{4}$/.test(yymm)) return `${yymm}-01-01`;
  if (/^\d{4}-\d{2}$/.test(yymm)) return `${yymm}-01`;
  return null;
}

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN is required to run this script.');
    process.exit(1);
  }

  try {
    for (let i = 0; i < resume.experience.length; i += 1) {
      const exp = resume.experience[i];
      const doc = {
        _id: `experience_${exp.id}`,
        _type: 'experience',
        company: exp.company,
        role: exp.role,
        startDate: toISODate(exp.start),
        endDate: toISODate(exp.end),
        summary: exp.summary,
        responsibilities: exp.bullets || [],
        story: exp.summary
          ? [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: exp.summary,
                  },
                ],
              },
            ]
          : [],
        order: i,
      };

      const res = await client.createOrReplace(doc);
      console.log('Created/Updated experience:', res._id);
    }

    console.log('Seeding complete. Check the Studio to verify documents.');
  } catch (err) {
    console.error('Error seeding experience:', err);
    process.exit(1);
  }
}

run();

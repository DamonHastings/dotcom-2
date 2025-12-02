import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

/*
  Migration script: migrate-resume-to-experiences.mjs

  Usage:
    - Copy your resume JSON to a file or embed it below (the script includes an example payload).
    - Ensure your SANITY_WRITE_TOKEN and project env vars are set (e.g. in .env.local).
    - Run: `node scripts/migrate-resume-to-experiences.mjs`

  This script will createOrReplace experience documents with `_id` = `experience_<resume-experience-id>`
  and set fields used by the site's `experience` schema (company, role, startDate, endDate, summary,
  responsibilities, story, order).
*/

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2023-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Replace or load your resume JSON here. This example uses the JSON provided.
const resume = {
  id: '1764651534654',
  resumeName: 'Genera V1',
  name: 'Damon Hastings',
  title: 'Senior Full-Stack Engineer ',
  contact: {
    email: 'damonjhastings@gmail.com',
    phone: '+1 (707) 718-1871',
    location: 'Davis, CA',
    website: 'https://damonhastings.com',
    links: [
      { label: 'linkedin.com/in/damonhastings', url: 'https://linkedin.com/in/damonhastings' },
      { label: 'github.com/damonhastings', url: 'https://github.com/damonhastings' },
    ],
  },
  summary:
    'Senior full‑stack engineer with a frontend edge, 10+ years shipping product in fast‑moving startups. I own outcomes end‑to‑end—from shaping scope with founders and design, to building reliable, well‑tested UIs and services, instrumenting metrics, and iterating quickly. Strong with React/TypeScript, Next.js, Node/NestJS, GraphQL, CI/CD, and performance. Familiar with real‑time patterns (WebSockets) and modern AI/LLM integration workflows.',
  skills: [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'NestJS',
    'GraphQL',
    'REST APIs',
    'WebSockets (familiar)',
    'Redux',
    'Design systems (MUI, Storybook)',
    'Accessibility (a11y)',
    'Testing (Jest, Cypress)',
    'Experimentation & analytics',
    'System design',
    'AWS',
    'Docker',
    'CI/CD (GitHub Actions, CircleCI)',
    'Monorepos (Yarn/PNPM)',
    'Product discovery & collaboration',
    'AI/LLM integration (familiar)',
  ],
  experience: [
    {
      id: '62c70c45-9612-4ba9-8cc4-69c0a453a9a9',
      company: 'Vouch Insurance',
      role: 'Senior Software Engineer',
      start: '2021-02',
      end: '2025-08',
      summary:
        'Owned high‑impact web initiatives from scope through launch, partnering with Product, Design, and Insurance stakeholders.',
      bullets: [
        'Led migration of Quoting app to React with Redux and modern patterns; simplified state, reduced unnecessary renders, and improved perceived latency.',
        'Shaped requirements and shipped features end‑to‑end (frontend + API contracts), balancing delivery speed with quality, tests, and observability.',
        'Established a reusable component library and design system (MUI + Storybook) adopted across teams; improved consistency and development speed.',
        'Instrumented analytics and defined success metrics (latency, error rates, conversion); ran lightweight experiments to guide product decisions.',
        'Contributed to service‑oriented architecture (NestJS + GraphQL) to decouple frontend from legacy systems, improving reliability and iteration speed.',
        'Raised engineering quality via PR reviews, mentorship, a11y practices, and CI gates (type safety, test coverage, lint rules).',
      ],
    },
    {
      id: '414eeeb0-f81c-42d5-a13d-10f3cc61449b',
      company: 'Parsley Health',
      role: 'Growth Engineer',
      start: '2018-08',
      end: '2019-12',
      summary:
        'Partnered with Marketing and Design to iterate quickly while keeping performance and quality high.',
      bullets: [
        'Improved the Marketplace UI by fixing bugs, refining interactions, and enhancing end-to-end user flows in collaboration with the E-Commerce team',
        'Partnered with the Marketing team to implement growth experiments and ensure accurate event tracking and analytics for campaign performance.',
        'Supported Engineering in the migration to integrate Marketing and E-Commerce experiences with the core subscription platform, contributing to a more unified user journey.',
      ],
    },
    {
      id: '4557f98f-f9ea-41eb-85a1-40612b9d5b90',
      company: 'Walker & Company (Procter & Gamble Subsidiary)',
      role: 'Software Engineer',
      start: '2016-02',
      end: '2018-07',
      summary:
        'Led front‑end development through acquisition; delivered performant, brand‑forward web experiences.',
      bullets: [
        'Introduced experimentation framework and collaborated with Product/Design on growth initiatives; prioritized a11y and performance budgets.',
      ],
    },
    {
      id: '685b349d-dee5-4e19-8264-67dc5e70c8d7',
      company: 'Elefint',
      role: 'WordPress Developer',
      start: '2015-01',
      end: '2016-02',
      summary: 'Built custom sites for non‑profits with interactive data visualizations.',
      bullets: [],
    },
    {
      id: '83af9d98-9cdc-44d8-9c27-454f3095d0d7',
      company: 'AG Design',
      role: 'Contract Software Engineer & UI Designer',
      start: '2013-05',
      end: '2015-05',
      summary: 'Delivered contract web projects with a focus on UI/UX design.',
      bullets: [],
    },
    {
      id: '8f61096c-7ce6-4660-8438-ca4ee740249b',
      company: 'Gensler',
      role: 'Software Engineer',
      start: '2010-12',
      end: '2013-05',
      summary: 'Built internal tools for global architecture and design teams.',
      bullets: [],
    },
  ],
  projects: [
    {
      id: 'proj-design-system',
      name: 'Design System & Component Library',
      description:
        'Established MUI + Storybook design system with tokens, theming, and docs; accelerated multi‑team delivery and improved UI consistency.',
      tech: ['React', 'TypeScript', 'MUI', 'Storybook'],
      links: [],
    },
    {
      id: 'proj-quoting-migration',
      name: 'Quoting App Migration (Vue → React)',
      description:
        'Rebuilt core flows with React/Redux, normalized state, and render performance improvements; introduced testing and CI guardrails.',
      tech: ['React', 'TypeScript', 'Redux', 'Jest', 'Cypress'],
      links: [],
    },
  ],
  education: [
    {
      id: '629c382f-628c-4dd6-9507-8cb49b96e7cd',
      school: 'San Diego State University',
      degree: 'B.S. Economics, Computer Science',
      start: '2002',
      end: '2007',
    },
  ],
  template: 'modern',
  variantOf: '1762309348417',
  archived: false,
};

function toISODate(yymm) {
  if (!yymm) return null;
  if (/^\d{4}$/.test(yymm)) return `${yymm}-01-01`;
  if (/^\d{4}-\d{2}$/.test(yymm)) return `${yymm}-01`;
  return null;
}

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error(
      'SANITY_WRITE_TOKEN is required to run this script. Set it in .env.local or the environment.'
    );
    process.exit(1);
  }

  try {
    // We'll upsert experiences in the provided order so that newer entries can be ordered first if desired.
    for (let i = 0; i < resume.experience.length; i += 1) {
      const exp = resume.experience[i];

      const doc = {
        _id: `experience_${exp.id}`,
        _type: 'experience',
        company: exp.company,
        role: exp.role || null,
        startDate: toISODate(exp.start),
        endDate: toISODate(exp.end),
        summary: exp.summary || null,
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
        resume: { shortSummary: exp.summary || null, bullets: exp.bullets || [] },
        order: i,
      };

      const res = await client.createOrReplace(doc);
      console.log('Created/Updated experience:', res._id);
    }

    console.log('Migration complete. Review documents in Sanity Studio.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.SANITY_WRITE_TOKEN; // optional write token

let sanityClient: ReturnType<typeof createClient>;
if (!projectId) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('[Sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID – client disabled.');
  }
  // Create a stub client that throws on fetch
  sanityClient = {
    fetch: async () => {
      throw new Error('Sanity client not configured: set NEXT_PUBLIC_SANITY_PROJECT_ID');
    },
  } as any;
} else {
  sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token,
  });
}

const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: any) {
  return builder.image(source);
}

export async function fetchProjects() {
  if (!projectId) return [];
  return sanityClient.fetch(
    `*[_type == "project" && defined(title)]|order(order asc){_id, title, subtitle, slug, status, coverImage}`
  );
}

export type Service = {
  title: string;
  description?: string;
};

export type Skill = {
  name: string;
  category?: string;
  level?: string;
};

export type SiteInfo = {
  title: string;
  subtitle?: string;
  summary?: string;
  contactEmail?: string;
  services?: Service[];
  skills?: Skill[];
  resumeUrl?: string;
};

export async function fetchSiteInfo(): Promise<SiteInfo | null> {
  if (!projectId) return null;
  const query = `*[_type == "siteInfo"]|order(order asc)[0]{
    title,
    subtitle,
    summary,
    contactEmail,
    services[]{title, description},
    skills[]{name, category, level},
    resume: resume.asset->url
  }`;
  const data = await sanityClient.fetch(query);
  if (!data) return null;
  return {
    title: data.title,
    subtitle: data.subtitle,
    summary: data.summary,
    contactEmail: data.contactEmail,
    services: data.services || [],
    skills: data.skills || [],
    resumeUrl: data.resume || undefined,
  } as SiteInfo;
}

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

let builder: ReturnType<typeof imageUrlBuilder> | null = null;
if (projectId) {
  // Only create the image builder when a real client is configured
  builder = imageUrlBuilder(sanityClient as any);
}
export function urlFor(source: any) {
  if (!builder) {
    // eslint-disable-next-line no-console
    console.warn('[sanity] urlFor called without configured image builder');
    // Return a small chainable stub so callers that do `.width(...).url()` won't crash.
    const stub: any = {
      image: (_: any) => stub,
      width: (_: number) => stub,
      height: (_: number) => stub,
      fit: (_: any) => stub,
      auto: (_: any) => stub,
      url: () => '',
    };
    return stub as any;
  }
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
  social?: { platform: string; url: string }[];
};

export type LandingPage = {
  heroHeading?: string[] | null;
  heroTagline?: string | null;
  summary?: string | null;
  primaryCtas?: { label: string; href: string }[] | null;
  secondaryCtas?: { label: string; href: string }[] | null;
  featuredProjects?:
    | {
        _id: string;
        title: string;
        subtitle?: string;
        slug?: { current: string };
        coverImage?: { _type?: 'image'; asset?: { _ref: string } };
      }[]
    | null;
  heroImage?: { _type?: 'image'; asset?: { _ref?: string }; alt?: string } | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type Experience = {
  _id: string;
  company: string;
  role?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  duration?: string | null;
  summary?: string | null;
  responsibilities?: string[] | null;
  technologies?: string[] | null;
  logo?: { _type?: 'image'; asset?: { _ref?: string }; alt?: string } | null;
  link?: string | null;
  order?: number | null;
  // portable text story (array of block objects) and resume structured object
  story?: any[] | null;
  resume?: { shortSummary?: string | null; bullets?: string[] | null } | null;
};

export async function fetchExperiences(): Promise<Experience[]> {
  if (!projectId) return [];
  const query = `*[_type == "experience"]|order(order asc, startDate desc){
    _id,
    company,
    role,
    startDate,
    endDate,
    duration,
    summary,
    responsibilities,
    technologies,
    logo,
    story,
    resume{shortSummary, bullets},
    link,
    order
  }`;
  try {
    const data = await sanityClient.fetch(query);
    if (!data) return [];
    return data.map((d: any) => ({
      _id: d._id,
      company: d.company,
      role: d.role ?? null,
      startDate: d.startDate ?? null,
      endDate: d.endDate ?? null,
      duration: d.duration ?? null,
      summary: d.summary ?? null,
      responsibilities: d.responsibilities ?? null,
      technologies: d.technologies ?? null,
      logo: d.logo ?? null,
      story: d.story ?? null,
      resume: d.resume ?? null,
      link: d.link ?? null,
      order: d.order ?? null,
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[sanity] fetchExperiences error:', err);
    return [];
  }
}

export async function fetchSiteInfo(): Promise<SiteInfo | null> {
  if (!projectId) return null;
  const query = `*[_type == "siteInfo"]|order(order asc)[0]{
    title,
    subtitle,
    summary,
    contactEmail,
    services[]{title, description},
    skills[]{name, category, level},
    "resume": resume.asset->url,
    social[]{platform, url}
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
    resumeUrl: data.resume ?? null,
    social: data.social ?? [],
  } as SiteInfo;
}

export async function fetchLanding(): Promise<LandingPage | null> {
  if (!projectId) return null;
  const query = `*[_type == "landingPage"][0]{
    heroHeading,
    heroImage,
    heroTagline,
    summary,
    primaryCtas[]{label, href},
    secondaryCtas[]{label, href},
    featuredProjects[]->{_id, title, subtitle, slug, coverImage},
    seoTitle,
    seoDescription
  }`;
  try {
    const data = await sanityClient.fetch(query);
    if (!data) return null;
    // Normalize heroHeading to string[] when editors enter a single string or other truthy value
    let heroHeading: string[] | undefined;
    if (Array.isArray(data.heroHeading)) {
      heroHeading = data.heroHeading.map((v: any) => (v == null ? '' : String(v))).filter(Boolean);
    } else if (data.heroHeading) {
      heroHeading = [String(data.heroHeading)];
    }

    return {
      heroHeading: heroHeading ?? null,
      heroImage: data.heroImage ?? null,
      heroTagline: data.heroTagline ?? null,
      summary: data.summary ?? null,
      primaryCtas: data.primaryCtas ?? null,
      secondaryCtas: data.secondaryCtas ?? null,
      featuredProjects: data.featuredProjects ?? null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
    } as LandingPage;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[sanity] fetchLanding error:', err);
    return null;
  }
}

import Head from 'next/head';
import React from 'react';
// Link import removed (unused)
import { fetchLanding, fetchSiteInfo } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
// ArrowLink/ComboLink imports removed (unused after cleanup)
import SocialIcons from '@/components/SocialIcons';
import ContactSection from '@/components/ContactSection';

export default function Landing() {
  const [landingDataState, setLandingDataState] = React.useState<unknown | null>(null);
  const [siteInfoDataState, setSiteInfoDataState] = React.useState<unknown | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchLanding();
        const siteInfoData = await fetchSiteInfo();
        if (mounted) {
          setLandingDataState(data);
          setSiteInfoDataState(siteInfoData);
        }
      } catch (err) {
        // fail silently and keep defaults
        console.error('fetchLanding error', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // sensible defaults so the page renders while the fetch completes
  type LandingData = {
    name?: string;
    tagline?: string;
    description?: string;
    email?: string;
    heroImage?: unknown;
    heroHeading?: string[];
    pageTitle?: string;
    pageDescription?: string;
    summary?: unknown;
  };
  const landing = (landingDataState ?? {}) as LandingData;
  const siteInfo = (siteInfoDataState ?? {}) as Record<string, unknown>;

  const { tagline, heroHeading, pageTitle, pageDescription, summary } = landing;
  const contactEmail = siteInfo.contactEmail as string | undefined;
  const title = siteInfo.title as string | undefined;
  const resumeUrl = siteInfo.resumeUrl as string | undefined;
  const social = siteInfo.social as unknown as unknown[] | undefined;
  const heroHeadingText = heroHeading ? heroHeading.join(' x ') : null;

  // removed unused helper components to avoid lint noise

  const Title = () => {
    return title ? <h1 className="text-4xl font-extrabold ">{title}</h1> : <></>;
  };
  const HeroHeading = () => {
    return heroHeadingText ? (
      <h2 className="text-3xl md:text-3xl font-medium mb-4">
        {heroHeading &&
          heroHeading.map((text, index) => (
            <span key={index}>
              {text}
              {index < heroHeading.length - 1 ? (
                <>
                  &nbsp;x
                  <br />
                </>
              ) : (
                ''
              )}
            </span>
          ))}
      </h2>
    ) : (
      <></>
    );
  };
  const Tagline = () => {
    return tagline ? <h3 className="text-xl mb-3">{tagline}</h3> : <></>;
  };
  const Summary = () => {
    return summary ? (
      <div className="mb-4 prose max-w-none">
        <PortableText value={summary} />
      </div>
    ) : (
      <></>
    );
  };

  // ContactSection moved to its own component

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <main className="min-h-screen bg-slate-200 text-black relative">
        <section className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-8 pt-20 gap-0 max-w-6xl place-content-center">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-3">
            <div className="px-6">
              <Title />
              <HeroHeading />
              <SocialIcons social={social} className="flex gap-6 justify-start mb-4" />
              <div className="md:block hidden mt-10">
                <ContactSection contactEmail={contactEmail} resumeUrl={resumeUrl} />
              </div>
            </div>
          </div>
          <div className="col-span-3 flex flex-col justify-start px-6">
            <Tagline />
            <Summary />
            <div className="md:hidden">
              <ContactSection contactEmail={contactEmail} resumeUrl={resumeUrl} />
            </div>
          </div>
          <div className="flex flex-col mt-8"></div>
        </section>
      </main>
    </>
  );
}

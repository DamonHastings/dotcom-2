import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import { fetchLanding, fetchSiteInfo, urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ArrowLink from '@/components/ArrowLink';
import ComboLink from '@/components/ComboLink';
import { IconDuplicate, IconEnvelope, IconFileLines, IconOffice } from '@/components/icons';
import SocialIcons from '@/components/SocialIcons';

export default function Landing() {
  const [landingDataState, setLandingDataState] = React.useState<any>(null);
  const [siteInfoDataState, setSiteInfoDataState] = React.useState<any>(null);

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
    heroImage?: any;
    heroHeading?: string[];
    pageTitle?: string;
    pageDescription?: string;
    summary?: any;
  };
  const landing = (landingDataState ?? {}) as LandingData;
  const siteInfo = siteInfoDataState ?? {};

  const {
    name,
    tagline,
    description,
    email,
    heroImage,
    heroHeading,
    pageTitle,
    pageDescription,
    summary,
  } = landing;
  const { contactEmail, title, resumeUrl, siteName, siteDescription, siteUrl, social } = siteInfo;
  const heroImageUrl = landing?.heroImage ? urlFor(landing.heroImage).width(1200).url() : null;
  const heroHeadingText = heroHeading ? heroHeading.join(' x ') : null;
  console.log('Landing data:', landing);
  console.log('Site info data:', siteInfo);
  console.log('Hero Heading:', heroHeading);

  const CTALinks = ({ classes }: { classes: string }) => {
    return (
      <div>
        {contactEmail && (
          <ArrowLink variant="primary" href={`mailto:${contactEmail}`} className={classes}>
            {contactEmail}
          </ArrowLink>
        )}
        {resumeUrl && (
          <ArrowLink variant="secondary" href={resumeUrl}>
            View Resume
          </ArrowLink>
        )}
      </div>
    );
  };

  const ProfileImage = ({ width = 320, height = 320 }: { width?: number; height?: number }) => {
    if (!heroImageUrl) return null;
    return (
      <div>
        <img
          src={heroImageUrl}
          alt={name || 'Hero Image'}
          width={width}
          height={height}
          className={`max-w-[100%] md:w-[${width}px] `}
        />
      </div>
    );
  };

  const ContactLinks = () => {
    return (
      <div className="grid gap-2 mb-4">
        {resumeUrl && (
          <div className="bg-white px-4 py-2">
            <ComboLink
              variant="text"
              links={[
                {
                  href: '',
                  iconName: 'download',
                },
                {
                  href: '/work-history',
                  iconName: 'view',
                },
              ]}
            >
              Resume
            </ComboLink>
          </div>
        )}

        {contactEmail && (
          <div className="bg-white px-4 py-2">
            <ComboLink
              variant="text"
              links={[
                { href: '', iconName: 'copy' },
                { href: `mailto:${contactEmail}`, iconName: 'email' },
              ]}
            >
              Email
            </ComboLink>
          </div>
        )}
      </div>
    );
  };

  const Title = () => {
    return title ? <h1 className="text-4xl font-extrabold ">{title}</h1> : <></>;
  };
  const HeroHeading = () => {
    return heroHeadingText ? (
      <h2 className="text-3xl md:text-3xl font-semibold mb-4">
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
              <SocialIcons social={social} />
            </div>
            <div className="flex flex-col mt-8">
              <Link href="/work-history" className="inline-block mx-6 mb-3">
                <div className="flex items-center space-x-2 text-indigo-600 hover:underline">
                  <IconOffice />
                  <span className="font-medium">View Work History</span>
                </div>
              </Link>
              {resumeUrl ? (
                <Link
                  href={resumeUrl}
                  download
                  className="inline-block mb-3 mx-6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center space-x-2 text-indigo-600 hover:underline">
                    <IconFileLines />
                    <span className="font-medium">Download Resume</span>
                  </div>
                </Link>
              ) : null}
              <Link href="/work-history" className="inline-block mx-6 mb-3">
                <div className="flex items-center space-x-2 text-indigo-600 hover:underline">
                  <IconEnvelope />
                  <span className="font-medium">Send a Message</span>
                </div>
              </Link>
              {contactEmail && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(contactEmail);
                      } else {
                        const el = document.createElement('textarea');
                        el.value = contactEmail;
                        document.body.appendChild(el);
                        el.select();
                        document.execCommand('copy');
                        document.body.removeChild(el);
                      }
                    } catch (err) {
                      console.error('Copy failed', err);
                    }
                  }}
                  className="inline-block mx-6 mb-3"
                >
                  <div className="flex items-center space-x-2 text-indigo-600 hover:underline">
                    <IconDuplicate />
                    <span className="font-medium">Copy Email Address</span>
                  </div>
                </button>
              )}
            </div>
          </div>
          <div className="col-span-3 flex px-6">
            <Tagline />
            <Summary />
          </div>
        </section>
      </main>
    </>
  );
}

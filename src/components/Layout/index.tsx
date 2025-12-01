import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import { fetchSiteInfo, type SiteInfo } from '@/lib/sanity';
import { IconGithub, IconLinkedin, IconTwitter } from '../icons';

const Header: React.FC<{ site?: SiteInfo | null }> = ({ site }) =>
  false ? (
    <header
      className="px-6 py-4 bg-black backdrop-blur supports-[backdrop-filter]:bg-background-black sticky top-0 z-30 text-white"
      style={{ fontFamily: 'var(--font-inter, system-ui, -apple-system, Roboto, Arial)' }}
    >
      <div className="max-w-6xl mx-auto md:gap-20 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-3xl">
            {site?.title || 'Portfolio'}
          </Link>
          {site?.subtitle && (
            <span
              className="hidden sm:inline text-sm text-muted-foreground"
              style={{
                fontFamily: 'var(--font-fraunces, serif)',
              }}
            >
              {site?.subtitle}
            </span>
          )}
          {/* Social icons next to title */}
          {site?.social && site?.social?.length ? (
            <div className="hidden sm:flex items-center space-x-3 ml-3">
              {site?.social?.filter(Boolean).map((s, i) => {
                if (!s || !s.platform) return null;
                const platform = String(s.platform).toLowerCase();
                const key = `${platform}-${i}`;
                const href = s.url || '#';
                // Simple platform -> SVG map
                const icons: Record<string, React.ReactNode> = {
                  github: <IconGithub />,
                  linkedin: <IconLinkedin />,
                  twitter: <IconTwitter />,
                  dribbble: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm6.2 5.19c2.38 2.6 2.11 6.3.76 9.12-1.81-.32-4.19-.42-6.1-.25-.1-.28-.2-.55-.29-.83 2.34-.57 4.57-1.62 5.9-2.9-1.24-1.37-2.86-2.49-4.74-3.28 2.06-1.49 4.73-2.61 8.47-1.86z" />
                    </svg>
                  ),
                  instagram: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-3a1 1 0 110 2 1 1 0 010-2z" />
                    </svg>
                  ),
                };

                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={String(s.platform)}
                  >
                    {icons[platform as keyof typeof icons] || null}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="flex items-center">
          {/* <nav className="mr-4 text-sm">
          <Link href="/projects" className="mr-4 hover:underline">
            Projects
          </Link>
          <Link href="/about" className="mr-4 hover:underline">
            About
          </Link>
          <Link href="/skills" className="mr-4 hover:underline">
            Skills
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </nav> */}
          {/* <ThemeToggle /> */}
          <Link
            href="/work-history"
            className="text-cyan-400 hover:text-cyan-300 hover:text-decoration-line text-2xl"
          >
            View My Resume
          </Link>
        </div>
      </div>
      <div className="max-w-6xl text-2xl mx-auto md:gap-20 mt-2 flex items-center justify-between">
        Software Engineer & Media Designer.
      </div>
    </header>
  ) : (
    <></>
  );

const SocialIcons = ({ social }: { social: any[] }) => {
  return (
    <div className="flex space-x-6 justify-center md:justify-start">
      {social &&
        social.map((soc: any) => {
          {
            console.log('Processing social:', soc);
          }
          if (soc.platform === 'github' && soc.url) {
            return (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
                aria-label="GitHub"
              >
                <IconGithub className="w-6 h-6" color="black" />
              </a>
            );
          }
          if (soc.platform === 'linkedin' && soc.url) {
            return (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
                aria-label="LinkedIn"
              >
                {/* Replace with LinkedIn icon */}
                <IconLinkedin className="w-6 h-6" color="black" />
              </a>
            );
          }
          if (soc.platform === 'twitter' && soc.url) {
            return (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
                aria-label="Twitter"
              >
                <IconTwitter className="w-6 h-6" color="black" />
              </a>
            );
          }
          // Add more social platforms as needed
          return null;
        })}
    </div>
  );
};

const Footer: React.FC<{ site?: SiteInfo | null }> = ({ site }) => {
  return (
    <footer className="fixed bottom-0 w-full py-4 px-6 bg-white border-t border-gray-200">
      <SocialIcons social={site?.social || []} />
    </footer>
  );
};

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [site, setSite] = useState<SiteInfo | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSiteInfo()
      .then((data) => {
        if (!cancelled) setSite(data);
      })
      .catch((err) => {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('[Layout] Failed to fetch siteInfo:', err?.message || err);
          setSite(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header site={site} />
      <main className="flex-1 pb-20 bg-slate-200">
        {!loaded && (
          <div className="animate-pulse text-center py-6 text-muted-foreground text-sm">
            Loading site info…
          </div>
        )}
        {children}
      </main>
      <div className="fixed bottom-0 bg-white w-full flex justify-center">
        <Footer site={site} />
      </div>
    </div>
  );
};

export default Layout;

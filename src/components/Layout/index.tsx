import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import { fetchSiteInfo, type SiteInfo } from '@/lib/sanity';

const Header: React.FC<{ site?: SiteInfo | null }> = ({ site }) => (
  <header className="px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
    <div className="max-w-6xl mx-auto md:gap-20 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold text-3xl">
          {site?.title || 'Portfolio'}
        </Link>
        {site?.subtitle && (
          <span className="hidden sm:inline text-sm text-muted-foreground">{site.subtitle}</span>
        )}
        {/* Social icons next to title */}
        {site?.social && site.social.length ? (
          <div className="hidden sm:flex items-center space-x-3 ml-3">
            {site.social.filter(Boolean).map((s, i) => {
              if (!s || !s.platform) return null;
              const platform = String(s.platform).toLowerCase();
              const key = `${platform}-${i}`;
              const href = s.url || '#';
              // Simple platform -> SVG map
              const icons: Record<string, React.ReactNode> = {
                github: (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.38-3.88-1.38-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.93-.26 1.92-.39 2.91-.39.99 0 1.98.13 2.91.39 2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.71 5.41-5.29 5.69.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12 24 5.65 18.35.5 12 .5z" />
                  </svg>
                ),
                linkedin: (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.852 0-2.135 1.445-2.135 2.939v5.667H9.353V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433c-1.144 0-2.069-.927-2.069-2.068 0-1.143.925-2.07 2.069-2.07 1.145 0 2.069.927 2.069 2.07 0 1.141-.924 2.068-2.069 2.068zm1.777 13.019H3.56V9h3.554v11.452z" />
                  </svg>
                ),
                twitter: (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.5 3c-2.5 0-4.5 2.24-4.5 5 0 .39.04.76.13 1.12C8.09 8.9 4.1 6.87 1.67 3.9c-.43.73-.67 1.58-.67 2.48 0 1.71.87 3.22 2.2 4.1A4.48 4.48 0 01.8 10v.06c0 2.39 1.67 4.38 3.88 4.83a4.52 4.52 0 01-2.04.08c.57 1.8 2.22 3.11 4.17 3.15A9.01 9.01 0 010 19.54 12.76 12.76 0 006.92 21c8.3 0 12.84-7.08 12.84-13.22 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z" />
                  </svg>
                ),
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
        <ThemeToggle />
      </div>
    </div>
    <div className="max-w-6xl mx-auto md:gap-20 flex items-center justify-between">
      Engineer · Producer · Builder
    </div>
  </header>
);

const Footer: React.FC<{ site?: SiteInfo | null }> = ({ site }) => (
  <footer className="border-t py-8 mt-12">
    <div className="max-w-5xl mx-auto px-4 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        © {new Date().getFullYear()} {site?.title || 'Portfolio'}
      </div>
      {site?.contactEmail && (
        <div>
          <a href={`mailto:${site.contactEmail}`} className="hover:underline">
            {site.contactEmail}
          </a>
        </div>
      )}
    </div>
  </footer>
);

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
      <main className="flex-1">
        {!loaded && (
          <div className="animate-pulse text-center py-6 text-muted-foreground text-sm">
            Loading site info…
          </div>
        )}
        {children}
      </main>
      <Footer site={site} />
    </div>
  );
};

export default Layout;

import React, { useEffect, useState } from 'react';
// Link is unused in this layout variant
// Theme toggle not used in layout header; import removed
import { fetchSiteInfo, type SiteInfo } from '@/lib/sanity';
import { IconGithub, IconLinkedin, IconTwitter } from '../icons';

const Header: React.FC<{ site?: SiteInfo | null }> = () => null;

const SocialIcons = ({ social }: { social: Array<{ platform?: string; url?: string }> }) => {
  return (
    <div className="flex space-x-6 justify-center md:justify-start">
      {social &&
        social.map((soc) => {
          if (!soc || !soc.platform) return null;
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
      .catch((err: unknown) => {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('[Layout] Failed to fetch siteInfo:', String(err));
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

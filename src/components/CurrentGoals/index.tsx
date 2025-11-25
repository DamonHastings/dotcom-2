import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchSiteInfo, type SiteInfo } from '@/lib/sanity';
import ArrowLink from '@/components/ArrowLink';

const CurrentGoals: React.FC = () => {
  const [site, setSite] = useState<SiteInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteInfo()
      .then((data) => {
        if (!cancelled) setSite(data);
      })
      .catch(() => {
        if (!cancelled) setSite(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const email = site?.contactEmail;

  return (
    <section className="max-w-6xl mx-auto mb-8 grid gap-4 grid-cols-12">
      <div className="rounded-lg border p-6 bg-card col-span-8">
        <h3 className="text-2xl font-semibold mb-2">
          Open to full-time roles, fractional engineering leadership, and mission-driven
          collaborations.
        </h3>
        <p className="text-muted-foreground mb-4">
          I’m currently focused on building product-led experiences where design and engineering
          ship closely together. Open to senior engineering or product roles, contract work, and
          collaborative projects that explore fast experimentation and delightful UX.
        </p>

        <div className="flex items-center space-x-3">
          <Link
            href="/contact"
            className="inline-block rounded bg-primary px-4 py-2 text-white hover:opacity-95"
          >
            Get in touch
          </Link>

          {email ? (
            <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:underline">
              Email: {email}
            </a>
          ) : null}
        </div>
      </div>

      <div className="col-span-4">
        <div className="rounded-lg border p-6 bg-card">
          <h4 className="text-lg font-semibold mb-3">Let's Discuss:</h4>
          <ArrowLink variant="primary" href="/contact?topic=Full-time%20Roles">
            Full-time Roles
          </ArrowLink>
          <ArrowLink variant="secondary" href="/contact?topic=Contract%20Opportunities">
            Contract Opportunities
          </ArrowLink>
          <ArrowLink variant="secondary" href="/contact?topic=Product%20Ideas">
            Product Ideas
          </ArrowLink>
          <ArrowLink variant="tertiary" href="/contact?topic=Whatever%20you%27d%20like%21">
            Whatever you'd like!
          </ArrowLink>
        </div>
      </div>
    </section>
  );
};

export default CurrentGoals;

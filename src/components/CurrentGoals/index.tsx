import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchSiteInfo, type SiteInfo } from '@/lib/sanity';
import ArrowLink from '@/components/ArrowLink';
import SkillTimeline, { type TimelineEntry } from '@/components/SkillTimeline';

const CurrentGoals: React.FC = () => {
  const [site, setSite] = useState<SiteInfo | null>(null);

  const timeline: TimelineEntry[] = [
    { year: 2015, title: 'Junior SWE', skills: { JavaScript: 40, React: 20, Design: 10 } },
    { year: 2018, title: 'Mid SWE', skills: { JavaScript: 70, React: 60, Design: 25 } },
    { year: 2022, title: 'Senior SWE', skills: { JavaScript: 90, React: 85, Design: 50 } },
  ];

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
    <section className="max-w-6xl mx-auto mb-8 grid gap-4 grid-cols-12 rounded-lg border">
      <div className="p-6 bg-card col-span-8">
        <h3 className="text-2xl font-semibold mb-2">
          I'm open to full-time roles, fractional engineering leadership, and mission-driven
          collaborations.
        </h3>
        <p className="text-muted-foreground">
          I’m currently focused on building product-led experiences where design and engineering
          ship closely together. Open to senior engineering or product roles, contract work, and
          collaborative projects that explore fast experimentation and delightful UX.
        </p>
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Let's Discuss:</h4>
          <ArrowLink href="/contact?topic=Full-time%20Roles">Full-time Roles</ArrowLink>
          <ArrowLink href="/contact?topic=Contract%20Opportunities">
            Contract Opportunities
          </ArrowLink>
          <ArrowLink href="/contact?topic=Product%20Ideas">Product Ideas</ArrowLink>
          <ArrowLink href="/contact?topic=Whatever%20you%27d%20like%21">
            Whatever you'd like!
          </ArrowLink>
        </div>
      </div>
      <div className="col-span-4">
        <div className="p-6 bg-card">
          <SkillTimeline timeline={timeline} initialIndex={timeline.length - 1} />
        </div>
      </div>
    </section>
  );
};

export default CurrentGoals;

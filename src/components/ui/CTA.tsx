import React from 'react';
import Link from 'next/link';

type CTA = { label?: string; href?: string; variant?: string; openInNewTab?: boolean };

const CTAGroup: React.FC<{ ctas?: CTA[] }> = ({ ctas }) => {
  if (!ctas || !ctas.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {ctas.map((c, i) => {
        const base = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium';
        const variants: Record<string, string> = {
          primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
          secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
          ghost: 'bg-transparent text-indigo-600',
        };
        const cls = `${base} ${variants[c.variant ?? 'primary']}`;
        const external = !!c.href && /^https?:\/\//.test(c.href);
        return (
          <Link key={i} href={c.href ?? '#'} passHref legacyBehavior>
            <a
              className={cls}
              {...(external || c.openInNewTab
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {c.label}
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default CTAGroup;

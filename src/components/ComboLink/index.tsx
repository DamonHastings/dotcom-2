import React from 'react';
import Link from 'next/link';
import {
  IconExternal,
  IconGithub,
  IconEnvelope,
  IconDownload,
  IconList,
  IconGrid,
  IconCodeBracketSquare,
  IconDuplicate,
} from '@/components/icons';

export interface ComboLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text';
  links?: Array<{ href: string; label?: string; iconName?: string }>;
}

export function ComboLink({
  href = '',
  children,
  className = '',
  inline = false,
  variant = 'primary',
  links = [],
}: ComboLinkProps) {
  const base = inline ? 'inline-flex' : 'flex';

  const variantClasses: Record<NonNullable<ComboLinkProps['variant']>, string> = {
    // primary: keep current background (default)
    primary: 'bg-gray-200',
    // secondary: slightly lighter background
    secondary: 'bg-gray-100',
    // tertiary: transparent with a subtle border
    tertiary: 'bg-transparent border border-gray-200',
    // text: text only
    text: 'bg-transparent',
  };

  const wrapperClasses = `pb-1 sm:p-3 group transition-transform duration-150 ease-out md:hover:-translate-y-1 ${variantClasses[variant]} ${className}`;

  const getIcon = (name?: string) => {
    switch ((name || '').toLowerCase()) {
      case 'github':
        return IconGithub;
      case 'email':
      case 'envelope':
      case 'mail':
        return IconEnvelope;
      case 'download':
      case 'pdf':
        return IconDownload;
      case 'list':
        return IconList;
      case 'grid':
        return IconGrid;
      case 'code':
      case 'code-square':
        return IconCodeBracketSquare;
      case 'copy':
        return IconDuplicate;
      default:
        return IconExternal;
    }
  };

  return (
    <div key={href} className={wrapperClasses}>
      <div className="w-full flex items-center justify-between">
        {href ? (
          <Link href={href} className={`${base} items-center text-md md:text-base font-bold`}>
            <span className="transition-colors">{children}</span>
          </Link>
        ) : (
          <span className={`${base} items-center text-md md:text-base font-bold`}>{children}</span>
        )}

        <div className="flex items-center gap-2">
          {links.map((ln) => {
            const Icon = getIcon(ln.iconName);
            const isExternal = /^https?:\/\//i.test(ln.href);
            const btnClasses =
              'inline-flex items-center justify-center w-9 h-9 rounded bg-white/90 hover:bg-white text-black shadow-sm transition-colors';

            return isExternal ? (
              <a
                key={ln.href}
                href={ln.href}
                className={btnClasses}
                target="_blank"
                rel="noreferrer"
                aria-label={ln.label}
                title={ln.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ) : (
              <Link
                key={ln.href}
                href={ln.href}
                className={btnClasses}
                aria-label={ln.label}
                title={ln.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ComboLink;

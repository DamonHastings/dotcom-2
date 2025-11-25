import React from 'react';
import Link from 'next/link';

export interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export function ArrowLink({
  href,
  children,
  className = '',
  inline = false,
  variant = 'primary',
}: ArrowLinkProps) {
  const base = inline ? 'inline-flex' : 'flex';

  const variantClasses: Record<NonNullable<ArrowLinkProps['variant']>, string> = {
    // primary: keep current background (default)
    primary: 'bg-gray-200',
    // secondary: slightly lighter background
    secondary: 'bg-gray-100',
    // tertiary: transparent with a subtle border
    tertiary: 'bg-transparent border border-gray-200',
  };

  const wrapperClasses = `mb-4 p-2 sm:p-3 px-4 rounded group transition-transform duration-150 ease-out md:hover:-translate-y-1 ${variantClasses[variant]} ${className}`;

  return (
    <div key={href} className={wrapperClasses}>
      <Link href={href} className={`${base} items-center gap-1 text-md md:text-base font-bold`}>
        <span className="transition-colors">{children}</span>
        <span aria-hidden className="transition-transform group-hover:translate-x-1 ml-1">
          →
        </span>
      </Link>
    </div>
  );
}

export default ArrowLink;

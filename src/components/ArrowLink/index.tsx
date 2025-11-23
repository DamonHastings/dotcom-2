import React from 'react';
import Link from 'next/link';

export interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
}

export function ArrowLink({ href, children, className = '', inline = false }: ArrowLinkProps) {
  const base = inline ? 'inline-flex' : 'flex';
  return (
    <div
      key={href}
      className={`mb-4 bg-gray-100 p-2 sm:p-3 px-4 rounded group transition-transform duration-150 ease-out md:hover:-translate-y-1 ${className}`}
    >
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

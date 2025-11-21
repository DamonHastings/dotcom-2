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
    <Link
      href={href}
      className={`${base} items-center gap-1 text-sm md:text-base font-medium group ${className}`}
    >
      <span className="group-hover:underline underline-offset-4 decoration-gray-400 transition">
        {children}
      </span>
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export default ArrowLink;

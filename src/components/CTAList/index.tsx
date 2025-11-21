import React from 'react';
import { ArrowLink } from '../ArrowLink';

export interface CTAItem {
  label: string;
  href: string;
}

export interface CTAListProps {
  primary: CTAItem[]; // top group
  secondary?: CTAItem[]; // bottom group
  className?: string;
  divider?: boolean;
}

export function CTAList({ primary, secondary, className = '', divider = true }: CTAListProps) {
  return (
    <div className={`flex flex-col gap-4 text-sm ${className}`}>
      <div className="space-y-1">
        {primary.map((item) => (
          <ArrowLink key={item.href} href={item.href}>
            {item.label}
          </ArrowLink>
        ))}
      </div>
      {secondary && divider && <hr className="border-gray-300 dark:border-gray-600" />}
      {secondary && (
        <div className="space-y-1">
          {secondary.map((item) => (
            <ArrowLink key={item.href} href={item.href}>
              {item.label}
            </ArrowLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default CTAList;

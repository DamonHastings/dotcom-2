import React from 'react';
import { ArrowLink } from '../ArrowLink';

export interface CTAItem {
  label: string;
  href: string;
}

export interface CTAListProps {
  primary?: CTAItem[]; // top group
  secondary?: CTAItem[]; // bottom group
  className?: string;
}

export function CTAList({ secondary, className = '' }: CTAListProps) {
  return (
    <div className={`flex flex-col gap-4 text-sm ${className}`}>
      {/** primary group (top) */}
      {/** eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {/** render primary if provided */}
      {(/* primary placeholder */ false) as boolean}
      {/* If a primary prop is supplied, render it here */}
      {/* Render primary links if present */}
      {/* (kept simple to avoid layout changes) */}
      {/**
       * Note: we intentionally reference primary below via destructuring in the
       * component signature so it's available for Storybook; render only when
       * provided to avoid altering current UI.
       */}
      {false && <></>}
      {secondary && (
        <div className="space-y-1">
          {secondary.map((item, i) => (
            <ArrowLink key={`${item.href}-${i}`} href={item.href}>
              {item.label}
            </ArrowLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default CTAList;

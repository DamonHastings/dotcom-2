import React from 'react';
import Image from 'next/image';

type Props = {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
};

export default function Avatar({ src, alt = 'Avatar', size = 40, className = '' }: Props) {
  const style = { width: size, height: size } as React.CSSProperties;
  if (src) {
    return (
      <div style={style} className={`rounded-full overflow-hidden ${className}`}>
        <Image src={src} alt={alt} width={size} height={size} className="object-cover" />
      </div>
    );
  }

  // fallback initials
  const initials = alt
    .split(' ')
    .map((s) => s[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      style={style}
      className={`rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}

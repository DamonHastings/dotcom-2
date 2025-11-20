import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function Card({ children, className = '', ...props }: Props) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 border rounded-lg shadow-sm p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

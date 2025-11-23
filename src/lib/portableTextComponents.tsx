import React from 'react';

// Shared Portable Text components used across the app
export const blockRenderer = ({ children, value }: any) => {
  const hasChildren = React.Children.count(children) > 0;
  if (hasChildren) return <p className="text-base leading-relaxed mb-3 last:mb-0">{children}</p>;

  const rawText = (value?.children || [])
    .map((c: any) => c?.text ?? '')
    .filter(Boolean)
    .join(' ');

  return <p className="text-base leading-relaxed mb-3 last:mb-0">{rawText}</p>;
};

export const ptComponents = {
  types: {
    block: blockRenderer,
  },
  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ children, value }: any) => (
      <a href={value?.href} className="text-sky-600 hover:underline">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside">{children}</ol>,
  },
};

export default ptComponents;

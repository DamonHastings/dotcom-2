import React from 'react';

// Shared Portable Text components used across the app
export const blockRenderer = ({ children, value }: any) => {
  // Portable Text block renderer: respect block style (e.g., 'h1','h2','h3','normal')
  const style = (value && value.style) || 'normal';
  const hasChildren = React.Children.count(children) > 0;

  const content = hasChildren
    ? children
    : (value?.children || [])
        .map((c: any) => c?.text ?? '')
        .filter(Boolean)
        .join(' ');

  switch (style) {
    case 'h1':
      return <h1 className="type-h1 mb-3 last:mb-0">{content}</h1>;
    case 'h2':
      return <h2 className="type-h2 mb-3 last:mb-0">{content}</h2>;
    case 'h3':
      return <h3 className="type-h3 mb-3 last:mb-0">{content}</h3>;
    default:
      return <p className="type-body mb-3 last:mb-0">{content}</p>;
  }
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

import React from 'react';

type BaseProps = {
  as?: 'a' | 'button';
  children: React.ReactNode;
  className?: string;
};

type Props = BaseProps &
  (React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement>);

const IconButton = React.forwardRef<HTMLElement, Props>(
  ({ as = 'a', children, className = '', ...rest }, ref) => {
    const baseClass = `inline-flex items-center justify-center w-10 h-10 rounded-full border ${className}`;

    if (as === 'button') {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={baseClass}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={baseClass}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;

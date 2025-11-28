import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;

export const Typography = () => (
  <div
    style={{ padding: 24, fontFamily: 'var(--font-inter, system-ui, -apple-system, sans-serif)' }}
  >
    <h1 className="type-h1">This is H1 — Heading Display</h1>
    <h2 className="type-h2" style={{ marginTop: 16 }}>
      This is H2 — Section Heading
    </h2>
    <h3 className="type-h3" style={{ marginTop: 12 }}>
      This is H3 — Subsection
    </h3>

    <p className="type-lead" style={{ marginTop: 18 }}>
      This is lead text — used for short explanatory paragraphs that sit near the heading. It has
      slightly stronger weight and a relaxed line height for better readability.
    </p>

    <p className="type-body" style={{ marginTop: 12 }}>
      Body text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent
      libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
    </p>

    <p className="type-small" style={{ marginTop: 12 }}>
      Small caption text — supplementary information, captions and meta.
    </p>
  </div>
);

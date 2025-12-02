import type { Meta } from '@storybook/react';
import { PortableText } from '@portabletext/react';
import ptComponents from '@/lib/portableTextComponents';

const meta: Meta = {
  title: 'Foundations/Portable Text',
};

export default meta;

const sampleBlocks: unknown[] = [
  {
    _type: 'block',
    style: 'h1',
    children: [{ _type: 'span', text: 'PortableText H1 — rendered via ptComponents' }],
  },
  {
    _type: 'block',
    style: 'h2',
    children: [{ _type: 'span', text: 'PortableText H2 — section heading' }],
  },
  {
    _type: 'block',
    style: 'h3',
    children: [{ _type: 'span', text: 'PortableText H3 — subsection' }],
  },
  {
    _type: 'block',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: 'This is a paragraph block rendered by PortableText. It should use the centralized .type-body styles and show correct spacing.',
      },
    ],
  },
  {
    _type: 'block',
    style: 'normal',
    children: [
      { _type: 'span', text: 'Another paragraph to show spacing and last:mb-0 behavior.' },
    ],
  },
];

export const PortableTextPreview = () => (
  <div style={{ padding: 24 }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <PortableText value={sampleBlocks as any} components={ptComponents as any} />
  </div>
);

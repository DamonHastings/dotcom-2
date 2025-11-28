import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Colors',
};

export default meta;

const swatch = (varName: string, label?: string) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
    <div
      style={{
        width: 72,
        height: 48,
        background: `var(${varName})`,
        borderRadius: 6,
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    />
    <div style={{ fontFamily: 'var(--font-inter, system-ui, -apple-system, sans-serif)' }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{label ?? varName}</div>
      <div style={{ fontSize: 12, color: 'var(--color-muted, #64748b)' }}>{varName}</div>
    </div>
  </div>
);

export const Colors = () => (
  <div style={{ padding: 24 }}>
    {swatch('--color-primary', 'Primary')}
    {swatch('--color-secondary', 'Secondary')}
    {swatch('--color-accent', 'Accent')}
    {swatch('--color-surface', 'Surface')}
    {swatch('--color-inverse-surface', 'Inverse Surface')}
    {swatch('--color-text-default', 'Text (Default)')}
    {swatch('--color-text-inverse', 'Text (Inverse)')}
  </div>
);

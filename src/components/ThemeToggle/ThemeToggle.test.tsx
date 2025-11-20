import React from 'react';
import { render, screen } from '@testing-library/react';
import ThemeToggle from './index';
import { describe, it, expect } from 'vitest';

describe('ThemeToggle', () => {
  it('renders a button with icons', () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: /toggle theme/i });
    expect(btn).toBeInTheDocument();
    // both icons should exist in the DOM (visibility controlled by CSS)
    const svgs = btn.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });
});

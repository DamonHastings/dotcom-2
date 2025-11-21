import type { Meta, StoryObj } from '@storybook/react';
import { CTAList } from './index';

const meta: Meta<typeof CTAList> = {
  title: 'Components/CTAList',
  component: CTAList,
};
export default meta;
type Story = StoryObj<typeof CTAList>;

export const Default: Story = {
  args: {
    primary: [
      { label: 'View my Work', href: '#' },
      { label: 'View my Resume', href: '#' },
    ],
    secondary: [
      { label: 'Schedule a Call', href: '#' },
      { label: 'Start a Project', href: '#' },
    ],
  },
};

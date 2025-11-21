import type { Meta, StoryObj } from '@storybook/react';
import { CategoryTabs } from './index';

const meta: Meta<typeof CategoryTabs> = {
  title: 'Components/CategoryTabs',
  component: CategoryTabs,
};
export default meta;
type Story = StoryObj<typeof CategoryTabs>;

export const Default: Story = {
  args: {
    categories: ['Branding & Marketing Design', 'Product Design & Engineering', 'Media Production'],
  },
};

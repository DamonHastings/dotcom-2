import type { Meta, StoryObj } from '@storybook/react';
import { ArrowLink } from './index';

const meta: Meta<typeof ArrowLink> = {
  title: 'Components/ArrowLink',
  component: ArrowLink,
};
export default meta;
type Story = StoryObj<typeof ArrowLink>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'View my Work',
  },
};
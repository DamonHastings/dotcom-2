import type { Meta, StoryObj } from '@storybook/react';
import { HeroHeading } from './index';

const meta: Meta<typeof HeroHeading> = {
  title: 'Components/HeroHeading',
  component: HeroHeading,
};
export default meta;
type Story = StoryObj<typeof HeroHeading>;

export const Default: Story = {
  args: {
    lines: ['Software Engineer.', 'Digital Artist.', 'Creative Producer.'],
  },
};
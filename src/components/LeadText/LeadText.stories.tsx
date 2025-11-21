import type { Meta, StoryObj } from '@storybook/react';
import { LeadText } from './index';

const meta: Meta<typeof LeadText> = {
  title: 'Components/LeadText',
  component: LeadText,
};
export default meta;
type Story = StoryObj<typeof LeadText>;

export const Default: Story = {
  args: {
    heading: 'Let’s build the products, stories, and experiences you imagine.',
    children: 'From engineering to creative direction — I bring ideas to life end-to-end.',
  },
};
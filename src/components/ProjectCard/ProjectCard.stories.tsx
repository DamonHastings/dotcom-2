import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from './index';

const meta: Meta<typeof ProjectCard> = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
};
export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    title: 'Project 1',
    subtitle: 'Panta | Brand Design',
  },
};

export const Arrow: Story = {
  args: {
    title: 'Explore More',
    subtitle: 'More Projects',
    arrow: true,
  },
};
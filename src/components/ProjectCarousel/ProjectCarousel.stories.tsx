import type { Meta, StoryObj } from '@storybook/react';
import ProjectCarousel from './index';

const meta: Meta<typeof ProjectCarousel> = {
  title: 'Components/ProjectCarousel',
  component: ProjectCarousel,
};
export default meta;

export const Default: StoryObj<typeof ProjectCarousel> = {
  args: {
    intervalMs: 2500,
    projects: [
      { title: 'Project 1', subtitle: 'Panta | Brand Design' },
      { title: 'Project 2', subtitle: 'Panta | Web App' },
      { title: 'Project 3', subtitle: 'Panta | Marketing Site' },
      { title: 'Project 4', subtitle: 'Panta | Mobile UX' },
    ],
  },
};

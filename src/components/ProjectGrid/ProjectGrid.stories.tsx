import type { Meta, StoryObj } from '@storybook/react';
import { ProjectGrid } from './index';

const meta: Meta<typeof ProjectGrid> = {
  title: 'Components/ProjectGrid',
  component: ProjectGrid,
};
export default meta;
type Story = StoryObj<typeof ProjectGrid>;

export const Default: Story = {
  args: {
    projects: [
      { title: 'Project 1', subtitle: 'Panta | Brand Design' },
      { title: 'Project 2', subtitle: 'Panta | Brand Design' },
      { title: 'Project 3', subtitle: 'Panta | Brand Design' },
      { title: 'More', subtitle: 'More Projects', arrow: true },
    ],
  },
};
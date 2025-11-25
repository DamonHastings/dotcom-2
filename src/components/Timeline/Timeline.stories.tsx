import React from 'react';
import { Meta, Story } from '@storybook/react';
import Timeline from './index';

export default {
  title: 'Components/Timeline',
  component: Timeline,
} as Meta;

const Template: Story = (args) => (
  <div style={{ maxWidth: 720 }}>
    <Timeline {...args} />
  </div>
);

export const Example = Template.bind({});
Example.args = {
  experiences: [
    {
      company: 'Gensler',
      role: 'Junior Developer',
      startDate: '2010-01-01',
      endDate: '2012-07-01', // ~2.5 years
      technologies: ['JavaScript', 'HTML', 'CSS'],
    },
    {
      company: 'Walker and Company',
      role: 'Frontend Engineer',
      startDate: '2012-08-01',
      endDate: '2015-02-01', // ~2.5 years
      technologies: ['JavaScript', 'React', 'Node.js'],
    },
    {
      company: 'Vouch',
      role: 'Senior Engineer',
      startDate: '2015-03-01',
      endDate: '2018-09-01',
      technologies: ['TypeScript', 'React', 'AWS'],
    },
    {
      company: 'Current Co',
      role: 'Lead Engineer',
      startDate: '2019-01-01',
      // ongoing
      technologies: ['TypeScript', 'React', 'Node.js', 'AWS'],
    },
  ],
  stepMs: 120,
};

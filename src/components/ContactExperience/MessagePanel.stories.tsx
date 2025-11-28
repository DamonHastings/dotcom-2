import React from 'react';
import { Story, Meta } from '@storybook/react';
import MessagePanel from './MessagePanel';

export default {
  title: 'ContactExperience/MessagePanel',
  component: MessagePanel,
} as Meta<typeof MessagePanel>;

const Template: Story = (args) => (
  <div className="p-6 bg-gray-50">
    <MessagePanel {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: "Let's Discuss:",
  subtitleOptions: ['Full-Time Roles', 'Contracting Opportunities', 'Project Ideas', 'Other'],
  initialSubtitle: 'Full-Time Roles',
  resumeUrl: '/resume.pdf',
  emailLabel: 'Email in profile',
  profileLabel: 'Co-browse',
  onSend: (m: { text?: string }) => {
    // eslint-disable-next-line no-console
    console.log('Send', m);
    // eslint-disable-next-line no-alert
    alert('Message sent: ' + (m.text || '<empty>'));
  },
  onSchedule: (p: { slot: string | number | Date }) => {
    // eslint-disable-next-line no-console
    console.log('Schedule requested', p);
    // eslint-disable-next-line no-alert
    alert('Schedule: ' + new Date(p.slot).toLocaleString());
  },
};

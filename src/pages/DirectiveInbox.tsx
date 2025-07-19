import { ReactElement } from 'react';
import { Group, Text } from '@mantine/core';
import { Directive } from '@features/directives/Directive';
import { DirectiveDoc } from '@features/types';

const sampleDirectives: DirectiveDoc[] = [
  {
    id: 'dir-001',
    title: 'Increase Campus Wi-Fi Speed',
    description: 'Proposal to upgrade existing Wi-Fi infrastructure across all campus buildings for faster, more reliable access.',
    privateStatus: false,
    sponsors: ['user_123', 'user_456'],
    signatories: ['user_789', 'user_101'],
    passed: 'passed', // assuming 'passed' is a valid DirectiveStatus
    read: false,
    upVotes: 42,
  },
  {
    id: 'dir-002',
    title: 'Establish Mental Health Days',
    description: 'Proposal to allow students two excused mental health days per semester without requiring medical documentation.',
    privateStatus: false,
    sponsors: ['user_234'],
    signatories: ['user_345', 'user_678'],
    passed: 'pending', // assuming possible values: 'passed', 'pending', 'failed'
    read: true,
    upVotes: 128,
  },
  {
    id: 'dir-003',
    title: 'Implement Composting on Campus',
    description: 'A directive to establish compost bins in dining halls and educate students about sustainable waste management.',
    privateStatus: true,
    sponsors: ['user_999'],
    signatories: [],
    passed: 'failed',
    read: false,
    upVotes: 12,
  }
];

export const DirectiveInbox = (): ReactElement => {
  return (
    <Group p="lg">
      {sampleDirectives.map((directive) => (
        <Directive directive={directive}></Directive>
      ))}
    </Group>
  );
};

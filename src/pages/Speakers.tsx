import { ReactElement, useState } from 'react';
import { Center, Group, SegmentedControl, Stack, Text, Title } from '@mantine/core';
import { DelegateTimer } from '@features/chairing/components/DelegateTimer';
import { DelegateDoc } from '@features/types';
import { AddSpeakers } from '@features/chairing/components/AddSpeakers';

const mockDelegates: DelegateDoc[] = [
  {
    id: 'd1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    inviteStatus: 'accepted',
    minutes: 12,
    positionPaperSent: true,
    attendanceStatus: 'present',
    spoke: true,
  },
  {
    id: 'd2',
    name: 'Ben Carson',
    email: 'ben@example.com',
    inviteStatus: 'pending',
    minutes: 0,
    positionPaperSent: false,
    attendanceStatus: 'absent',
    spoke: false,
  },
  {
    id: 'd3',
    name: 'Catherine Lee',
    email: 'catherine@example.com',
    inviteStatus: 'accepted',
    minutes: 5,
    positionPaperSent: true,
    attendanceStatus: 'excused',
    spoke: false,
  },
];

export const Speakers = (): ReactElement => {
  const [listType, setListType] = useState<'primary' | 'secondary' | 'single'>('primary');
  
  return (
    <Stack p="xl">
      <Stack align='flex-start'>
        <Title order={1}>
          Speakers
        </Title>
        <SegmentedControl 
        data={['primary', 'secondary', 'single']}
        value={listType}
        onChange={(value) => setListType(value as 'primary' | 'secondary' | 'single')}
        />
      </Stack>
      <DelegateTimer delegate={mockDelegates[1]}></DelegateTimer>
      <AddSpeakers delegates={mockDelegates}></AddSpeakers>
      

    </Stack>
  );
};

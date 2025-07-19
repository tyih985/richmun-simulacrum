import { ReactElement, useState } from 'react';
import { Group, SegmentedControl, Stack, Text, Title } from '@mantine/core';
import { DelegateTimer } from '@features/chairing/components/DelegateTimer';
import { DelegateDoc } from '@features/types';

const mockDelegates: DelegateDoc[] = [
  {
    delegateId: 'd1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    inviteStatus: 'accepted',
    minutes: 12,
    positionPaperSent: true,
    attendanceStatus: 'present',
    spoke: true,
  },
  {
    delegateId: 'd2',
    name: 'Ben Carson',
    email: 'ben@example.com',
    inviteStatus: 'pending',
    minutes: 0,
    positionPaperSent: false,
    attendanceStatus: 'absent',
    spoke: false,
  },
  {
    delegateId: 'd3',
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
    <Stack p="lg">
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


    </Stack>
  );
};

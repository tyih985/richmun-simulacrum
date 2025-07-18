import { ReactElement } from 'react';
import { Stack, Text } from '@mantine/core';
import { DelegateRow } from '@features/chairing/components/DelegateRow';
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


export const RollCall = (): ReactElement => {
  return (
    <Stack p="lg" gap={0}>
      {mockDelegates.map((delegate) => (
      <DelegateRow key={delegate.delegateId} delegate={delegate}/>
      ))}
    </Stack>
  );
};

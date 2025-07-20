import { ReactElement, use, useEffect, useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { DelegateRow } from '@features/chairing/components/DelegateRow';
import { DelegateDoc } from '@features/types';
import { committeeQueries } from '@mutations/yeahglo';
import { useParams } from 'react-router-dom';
import { useCommitteeDelegates } from '@hooks/useNewStuff';

// const delegates: DelegateDoc[] = [
//   {
//     id: 'd1',
//     name: 'Alice Johnson',
//     email: 'alice@example.com',
//     inviteStatus: 'accepted',
//     minutes: 12,
//     positionPaperSent: true,
//     attendanceStatus: 'present',
//     spoke: true,
//   },
//   {
//     id: 'd2',
//     name: 'Ben Carson',
//     email: 'ben@example.com',
//     inviteStatus: 'pending',
//     minutes: 0,
//     positionPaperSent: false,
//     attendanceStatus: 'absent',
//     spoke: false,
//   },
//   {
//     id: 'd3',
//     name: 'Catherine Lee',
//     email: 'catherine@example.com',
//     inviteStatus: 'accepted',
//     minutes: 5,
//     positionPaperSent: true,
//     attendanceStatus: 'excused',
//     spoke: false,
//   },
// ];

const {getCommitteeDelegates} = committeeQueries;

export const RollCall = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();

 const { delegates, loading } = useCommitteeDelegates(committeeId);

  return (
    <Stack p="lg" gap={0}>
      {delegates.map((delegate) => (
      <DelegateRow key={delegate.id} delegate={delegate}/>
      ))}
    </Stack>
  );
};

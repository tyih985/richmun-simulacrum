import { ReactElement, use, useEffect, useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { DelegateRow } from '@features/chairing/components/DelegateRow';
import { DelegateDoc } from '@features/types';
import { committeeQueries } from '@mutations/yeahglo';
import { useParams } from 'react-router-dom';
import { useCommitteeDelegates } from '@hooks/useNewStuff';


const { getCommitteeDelegates } = committeeQueries;

export const RollCall = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();

  const { delegates, loading } = useCommitteeDelegates(committeeId);

  return (
    <Stack p="lg" gap={0}>
      {delegates.map((delegate) => (
        <DelegateRow key={delegate.id} delegate={delegate} />
      ))}
    </Stack>
  );
};

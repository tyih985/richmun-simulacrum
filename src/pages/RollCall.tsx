import { ReactElement } from 'react';
import { Stack } from '@mantine/core';
import { DelegateRow } from '@features/chairing/components/DelegateRow';
import { useParams } from 'react-router-dom';
import { useCommitteeDelegates } from '@hooks/useNewStuff';

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

import { ReactElement } from 'react';
import { Stack, Title, Loader, Container, Text } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useRollCallDelegates } from '@hooks/useNewStuff';
import { DelegateRow } from '@features/chairing/components/DelegateRow';

export const RollCall = (): ReactElement => {
  const { committeeId, rollCallId } = useParams<{
    committeeId: string;
    rollCallId: string;
  }>();

  const { delegates, loading } = useRollCallDelegates(
    committeeId,
    rollCallId
  );

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  if (!delegates.length) {
    return (
      <Container>
        <Title order={2}>Roll Call</Title>
        <Text color="dimmed">No delegates found.</Text>
      </Container>
    );
  }

  return (
    <Stack p="lg" gap={0}>
      <Title order={2}>Roll Call</Title>
      {delegates.map((d) => (
        <DelegateRow key={d.id} delegate={d} />
      ))}
    </Stack>
  );
};

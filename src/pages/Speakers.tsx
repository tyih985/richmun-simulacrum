import { ReactElement, useState } from 'react';
import { Center, Group, SegmentedControl, Stack, Text, Title } from '@mantine/core';
import { DelegateTimer } from '@features/chairing/components/DelegateTimer';
import { AddSpeakers } from '@features/chairing/components/AddSpeakers';
import { useParams } from 'react-router-dom';
import { useCommitteeDelegates } from '@hooks/useNewStuff';

export const Speakers = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const [listType, setListType] = useState<'primary' | 'secondary' | 'single'>('primary');
  const { delegates, loading } = useCommitteeDelegates(committeeId);

  if (loading) {
    return (
      <Center>
        <Text>Loading delegates...</Text>
      </Center>
    );
  }

  return (
    <Stack p="xl">
      <Stack align="flex-start">
        <Title order={1}>Speakers</Title>
        <SegmentedControl
          data={['primary', 'secondary', 'single']}
          value={listType}
          onChange={(value) => setListType(value as 'primary' | 'secondary' | 'single')}
        />
      </Stack>
      <DelegateTimer delegate={delegates[0]}></DelegateTimer>
      <AddSpeakers delegates={delegates}></AddSpeakers>
    </Stack>
  );
};

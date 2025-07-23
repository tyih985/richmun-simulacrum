import { ReactElement, useEffect, useState } from 'react';
import { Center, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { DelegateTimer } from '@features/chairing/components/DelegateTimer';
import { useParams } from 'react-router-dom';
import { useCommitteeDelegates, useMotion } from '@hooks/useNewStuff';
import { SpeakerSelector } from '@features/chairing/components/SpeakerSelector';
import type { DelegateDoc } from '@features/types';
import { updateFirestoreDocument } from '@packages/firestoreAsQuery/firestoreRequests';
import { committeeMotionPath } from '@packages/firestorePaths';

export const Caucus = (): ReactElement => {
  const { committeeId, motionId } = useParams<{
    committeeId: string;
    motionId: string;
  }>();
  const [currentSpeaker, setCurrentSpeaker] = useState<DelegateDoc | null>(null);

  const { delegates, loading: delLoading } =
    useCommitteeDelegates(committeeId!);
  const { motion, loading: motionLoading } =
    useMotion(committeeId!, motionId!);

  useEffect(() => {
    if (!currentSpeaker) return;
    const path = committeeMotionPath(committeeId!, motionId!);
    updateFirestoreDocument(path, {
      currentSpeaker: currentSpeaker.id,
    }).catch(console.error);
  }, [currentSpeaker, committeeId, motionId]);

  if (delLoading || motionLoading) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  }

  return (
    <Stack p="xl">
      <Title order={1}>Caucus</Title>
      <Text size="md" color="dimmed">
        Motion: {motion?.topic || 'No motion selected'}
      </Text>

      {currentSpeaker ? (
        <DelegateTimer
          cid={committeeId!}
          mid={motionId!}
          delegate={currentSpeaker}
          showNext={false}
        />
      ) : (
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" justify="center">
            <Text color="dimmed">No current speaker.</Text>
          </Stack>
        </Paper>
      )}

      <Group grow align="flex-start">
        <SpeakerSelector
          delegates={delegates}
          onAddSpeaker={setCurrentSpeaker}
        />
      </Group>
    </Stack>
  );
};

import { ReactElement, useState } from 'react';
import { Center, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { DelegateTimer } from '@features/chairing/components/DelegateTimer';
import { useParams } from 'react-router-dom';
import { useCommitteeDelegates, useMotion } from '@hooks/useNewStuff';
import { SpeakerSelector } from '@features/chairing/components/SpeakerSelector';
import { DelegateDoc } from '@features/types';
import { useSpeakerLog } from '@hooks/useSpeakerLog';

export const Caucus = (): ReactElement => {
  const { motionId } = useParams<{ motionId: string }>();
  const { committeeId } = useParams<{ committeeId: string }>();
  const [currentSpeaker, setCurrentSpeaker] = useState<DelegateDoc | null>(null);
  const { delegates, loading } = useCommitteeDelegates(committeeId);
  const { motion, loading: loadingMotions } = useMotion(committeeId, motionId);
  const { speakerLog } = useSpeakerLog(committeeId!, motionId!, currentSpeaker?.id)


  if (loading || loadingMotions) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  }

  console.log('Caucus motion:', motion);
  console.log('data:', speakerLog);

  return (
    <Stack p="xl">
      <Title order={1}>Caucus</Title>
      <Text size="md" c="dimmed">
        Motion: {motion?.topic || 'No motion selected'}
      </Text>

      {currentSpeaker ? (
        <DelegateTimer delegate={currentSpeaker} showNext={false} />
      ) : (
        <Paper p="xl" radius="md" withBorder>
          <Stack p="xl" align="center" justify="center" m={'3px'}>
            <Text c="dimmed">No current speaker.</Text>
          </Stack>
        </Paper>
      )}

      <Group grow align="flex-start">
        <SpeakerSelector delegates={delegates} onAddSpeaker={setCurrentSpeaker} />
      </Group>
    </Stack>
  );
};

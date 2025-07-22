import { ReactElement, useState } from 'react';
import {
  Center,
  SegmentedControl,
  Stack,
  Text,
  Title,
  Group,
  Paper,
} from '@mantine/core';
import { DelegateTimer } from '@features/chairing/components/DelegateTimer';
import { useParams } from 'react-router-dom';
import { useCommitteeDelegates } from '@hooks/useNewStuff';
import { SpeakerSelector } from '@features/chairing/components/SpeakerSelector';
import { SpeakerList } from '@features/chairing/components/SpeakerList';
import { committeeMutations } from '@mutations/committeeMutation';
import { TimerBar } from '@components/Timer';
import { DelegateDoc } from '@features/types';

const { addDelegateToCommittee } = committeeMutations();

export const Speakers = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const [listType, setListType] = useState<'primary' | 'secondary' | 'single'>('primary');
  const [speakers, setSpeakers] = useState<DelegateDoc[]>([]);
  const { delegates, loading } = useCommitteeDelegates(committeeId);

  if (loading) {
    return (
      <Center>
        <Text>Loading delegates...</Text>
      </Center>
    );
  }

  const addSpeaker = (delegate: DelegateDoc) => {
    if (!speakers.includes(delegate)) {
      setSpeakers([...speakers, delegate]);
      console.log('adding delegate:', delegate.name)
    }
  };

  const clearSpeakers = () => {
    setSpeakers([]);
  };

  const currentDelegate = delegates.find((d) => d === speakers[0]);

  const handleTimerComplete = () => {
    setSpeakers((prev) => prev.slice(1)); // removes the first speaker
    console.log(`Delegate ${currentDelegate?.name} has completed speaking.`);
  };

  const handleTimerStart = () => {
    if (committeeId && currentDelegate) {
      addDelegateToCommittee(
        committeeId,
        currentDelegate.id,
        currentDelegate.name,
        currentDelegate.email,
        currentDelegate.inviteStatus,
        currentDelegate.totalSpeakingDuration,
        currentDelegate.positionPaperSent,
        true, // Mark as spoke
      );
      console.log(`Delegate ${currentDelegate.name} has started speaking.`);
    }
  };

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

      {currentDelegate ? (
        <>
          <DelegateTimer 
          delegate={currentDelegate} 
          showNext={true}
          onStart={handleTimerStart}
          onComplete={handleTimerComplete} 
          />
        </>
      ) : (
        <Paper p="xl" radius="md" withBorder>
          <Stack p="xl" align="center" justify="center" m={'3px'}>
            <Text c="dimmed">No speakers added.</Text>
          </Stack>
        </Paper>
      )}

      <Group grow align="flex-start">
        <SpeakerSelector
          delegates={delegates}
          onAddSpeaker={addSpeaker}
          currentSpeakers={speakers.map((d)=>d.name)}
        />
        <SpeakerList speakers={speakers.map((d)=>d.name)} onClear={clearSpeakers} />
      </Group>
    </Stack>
  );
};

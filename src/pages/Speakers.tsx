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
import { DelegateDoc, MotionSpeakerDoc } from '@features/types';
import { useSpeakers } from '@hooks/useSpeakerLog';

const { addDelegateToCommittee, addMotionSpeaker } = committeeMutations();

export const Speakers = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const [listType, setListType] = useState<'primary' | 'secondary' | 'single'>('primary');
  const [currentSpeaker, setCurrentSpeaker] = useState<DelegateDoc | null>(null);
  const { delegates, loading: committeeLoading } = useCommitteeDelegates(committeeId);

  const { speakers, loading: speakerLoading } = useSpeakers(committeeId ?? '', 'default-motion') as {
    speakers: MotionSpeakerDoc[];
    loading: boolean;
  };

  if (committeeLoading || speakerLoading) {
    return (
      <Center>
        <Text>Loading delegates...</Text>
      </Center>
    );
  }

  const addPrimarySpeaker = (delegate: DelegateDoc) => {
    const speakersIds = speakers.map((s) => s.id);
    if (!speakersIds.includes(delegate.id)) {
      addMotionSpeaker(committeeId!, 'default-motion', delegate.id, delegate.name, speakers.length + 1);
      console.log('adding delegate:', delegate.name);
    }
  };

  // const removePrimarySpeaker = () => {

  // }

  const addSingleSpeaker = (delegate: DelegateDoc) => {
    setCurrentSpeaker(delegate);
  };

  const clearSpeakers = () => { 
     speakers.forEach(speaker => {
      addMotionSpeaker(committeeId!, 'default-motion', speaker.id, speaker.name, -1); // Resetting the order to -1
      console.log('clearing speaker:', speaker.id);
    });
    setCurrentSpeaker(null);
  };

  const currentDelegate = delegates.find((d) => d.id === speakers[0].id);

  const handleTimerComplete = () => {
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
          onChange={(value) => {
            setListType(value as 'primary' | 'secondary' | 'single');
            clearSpeakers();
          }}
        />
        <Text c="dimmed">{listType} speakers</Text>
      </Stack>

      {listType === 'primary' && (
        <>
          {currentDelegate ? (
            <DelegateTimer
              cid={committeeId!} // assuming committeeId is defined
              mid={'default-motion'}
              delegate={currentDelegate}
              showNext={true}
              // onNext ={}
            />
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
              onAddSpeaker={addPrimarySpeaker}
              currentSpeakers={speakers.map((d) => d.name)}
            />

            {/* vv filter for speakers with an order that exists */}
            <SpeakerList speakers={speakers.map((d) => d.name)} onClear={clearSpeakers} /> 
          </Group>
        </>
      )}

      {listType === 'secondary' && (
        <>
          {currentDelegate ? (
            <DelegateTimer
              delegate={currentDelegate}
              showNext={true}
              onStart={handleTimerStart}
              onComplete={handleTimerComplete}
            />
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
              onAddSpeaker={addPrimarySpeaker}
              currentSpeakers={speakers.map((d) => d.name)}
            />
            <SpeakerList speakers={speakers.map((d) => d.name)} onClear={clearSpeakers} />
          </Group>
        </>
      )}

      {listType === 'single' && (
        <>
          {currentSpeaker ? (
            <DelegateTimer
              delegate={currentSpeaker}
              showNext={true}
              onStart={handleTimerStart}
              onComplete={handleTimerComplete}
            />
          ) : (
            <Paper p="xl" radius="md" withBorder>
              <Stack p="xl" align="center" justify="center" m={'3px'}>
                <Text c="dimmed">No speakers added.</Text>
              </Stack>
            </Paper>
          )}

          <Group grow align="flex-start">
            <SpeakerSelector delegates={delegates} onAddSpeaker={addSingleSpeaker} />
          </Group>
        </>
      )}
    </Stack>
  );
};

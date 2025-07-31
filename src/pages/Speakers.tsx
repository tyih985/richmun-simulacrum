import { ReactElement, useEffect, useState } from 'react';
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
import { useCurrentSpeaker, useSpeakers } from '@hooks/useSpeakerLog';

const { addMotionSpeaker } = committeeMutations();

export const Speakers = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const [listType, setListType] = useState<'primary' | 'secondary' | 'single'>('primary');
  const { delegates, loading: committeeLoading } = useCommitteeDelegates(committeeId);
  console.log(delegates)
  const { speakerId, loading: getSpeakerLoading } = 
      useCurrentSpeaker(committeeId!, 'default-motion');
    console.log('fetched speaker:', speakerId);
  
  const [currentSpeaker, setCurrentSpeaker] = useState<DelegateDoc | null>(null);

  // sets current speaker when the speakerId in db changes
    useEffect(() => {
      const found = delegates.find((d) => d.id === speakerId) ?? null;
      console.log('current speaker:', found);
      setCurrentSpeaker(found);
    }, [speakerId, delegates]);

  const { speakers, loading: speakersLoading } = useSpeakers(committeeId ?? '', 'default-motion') as {
    speakers: MotionSpeakerDoc[];
    loading: boolean;
  };

  console.log(speakers)

  if (committeeLoading || speakersLoading || getSpeakerLoading) {
    return (
      <Center>
        <Text>Loading delegates...</Text>
      </Center>
    );
  }

  const addPrimarySpeaker = (delegate: DelegateDoc) => {
      addMotionSpeaker(committeeId!, 'default-motion', delegate.id, delegate.name, speakers.length + 1);
      console.log('adding delegate:', delegate.name);
  };

  // const removePrimarySpeaker = () => {

  // }

  // const addSingleSpeaker = (delegate: DelegateDoc) => {
  //   setCurrentSpeaker(delegate);
  // };

  const clearSpeakers = () => { 
     speakers.forEach(speaker => {
      addMotionSpeaker(committeeId!, 'default-motion', speaker.id, speaker.name, -1); // Resetting the order to -1
      console.log('clearing speaker:', speaker.id);
    });
    setCurrentSpeaker(null);
  };

  // const currentDelegate = speakers ? delegates.find((d) => d.id === speakers[0].id) : null;

  const handleTimerComplete = () => {
    console.log(`Delegate ${currentSpeaker?.name} has completed speaking.`);
  };

  // const handleTimerStart = () => {
  //   if (committeeId && currentDelegate) {
  //     addDelegateToCommittee(
  //       committeeId,
  //       currentDelegate.id,
  //       currentDelegate.name,
  //       currentDelegate.email,
  //       currentDelegate.inviteStatus,
  //       currentDelegate.totalSpeakingDuration,
  //       currentDelegate.positionPaperSent,
  //     );
  //     console.log(`Delegate ${currentDelegate.name} has started speaking.`);
  //   }
  // };

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
          {currentSpeaker ? (
            <DelegateTimer
              cid={committeeId!} // assuming committeeId is defined
              mid={'default-motion'}
              delegate={currentSpeaker}
              showNext={true}
              onNext ={handleTimerComplete}
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
              currentSpeakers={speakers.filter((s) => (s.order > 0)).map((s)=>s.id)}
            />

            {/* vv filter for speakers with an order > 0 */}
            <SpeakerList speakers={speakers.filter((s) => (s.order > 0)).map((d) => d.name)} onClear={clearSpeakers} /> 
          </Group>
        </>
      )}

      {/* {listType === 'secondary' && (
        <>
          {currentDelegate ? (
            <DelegateTimer
              delegate={currentDelegate}
              showNext={true}
              // onStart={handleTimerStart}
              // onComplete={handleTimerComplete}
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
              // onStart={handleTimerStart}
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
      )} */}
    </Stack>
  );
};

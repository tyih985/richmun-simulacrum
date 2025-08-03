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
import { committeeMotionPath } from '@packages/firestorePaths';
import { updateFirestoreDocument } from '@packages/firestoreAsQuery';

const { addMotionSpeaker, addMotionSpeakerLog } = committeeMutations();

export const Speakers = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const [listType, setListType] = useState<'primary' | 'secondary' | 'single'>('primary');
  
  const { delegates, loading: committeeLoading } = useCommitteeDelegates(committeeId);
  const { speaker: currentSpeaker, loading: getCurrentSpeakerLoading } = useCurrentSpeaker(committeeId!, 'default-motion');
  // speakers is all the people who have spoken or will speak
  const { speakers, loading: speakersLoading } = useSpeakers(committeeId ?? '', 'default-motion') as {
    speakers: MotionSpeakerDoc[];
    loading: boolean;
  };
  
  // sends the updated localCurrentSpeaker to the db -> TODO: make cloud function for this also
  const updateDBCurrentSpeaker = (speaker: MotionSpeakerDoc | null): void => {
    console.log('update current speaker')
    if (speaker?.id === currentSpeaker?.id) return;

    const path = committeeMotionPath(committeeId!, 'default-motion');

    if (!speaker) {
      updateFirestoreDocument(path, {
        currentSpeaker: '',
      });
      console.log('updated speaker:', speaker)
    } else {
      updateFirestoreDocument(path, {
        currentSpeaker: speaker.id,
      }).catch(console.error);
    }
  }

  if (committeeLoading || speakersLoading || getCurrentSpeakerLoading) {
    return (
      <Center>
        <Text>Loading delegates...</Text>
      </Center>
    );
  }

  const addPrimarySpeaker = (speaker: DelegateDoc | MotionSpeakerDoc) => {
    // TODO: update this. purely bc i am too lazy to completely redo the stuff in caucus rn

    const realSpeaker = speaker as MotionSpeakerDoc
    if (speakers.length == 0) {
      updateDBCurrentSpeaker(realSpeaker);
      console.log('woowaha:', currentSpeaker)
    }

    // setLocalSpeakers(prev => [...prev, realSpeaker as MotionSpeakerDoc]);
    
    addMotionSpeaker(
      committeeId!, 
      'default-motion', 
      speaker.id, 
      speaker.name, 
      speakers.length + 1
    );

    console.log('adding delegate:', speaker.name);
  };

  const removePrimarySpeaker = (speakerToRemove: MotionSpeakerDoc) => {
    // TODO: possibly update so that it takes in id not the whole doc
    const updatedSpeakers = speakers.filter(s => s.id !== speakerToRemove.id);

    // Update Firestore to remove this speaker (set order to -1)
    addMotionSpeaker(
      committeeId!,
      'default-motion',
      speakerToRemove.id,
      speakerToRemove.name,
      -1
    );

    // setLocalSpeakers(updatedSpeakers);

    // If removed speaker is the current speaker, update to next or null
    if (currentSpeaker?.id === speakerToRemove.id) {
      const nextSpeaker = updatedSpeakers[0] ?? null;
      updateDBCurrentSpeaker(nextSpeaker);
    }
  };


  const clearSpeakers = () => { 
     speakers.forEach(speaker => {
      addMotionSpeaker(committeeId!, 'default-motion', speaker.id, speaker.name, -1); // Resetting the order to -1
      console.log('clearing speaker:', speaker.id);
    });
    updateDBCurrentSpeaker(null);
  };

  const handleTimerComplete = () => {
    // i dont think this should ever happen but yeah
    if (!currentSpeaker || speakers.length === 0) return; 

    const currentIndex = speakers.findIndex(s => s.id === currentSpeaker.id);
    const nextSpeaker = speakers[currentIndex + 1];
    removePrimarySpeaker(currentSpeaker);

    if (nextSpeaker) {
      updateDBCurrentSpeaker(nextSpeaker);
    } else {
      // No more speakers left: clear current speaker
      updateDBCurrentSpeaker(null);
    }
  };

  // const handleTimerStart = () => {
  //   if (committeeId && localCurrentSpeakerId) {
  //     // addDelegateToCommittee(
  //     //   committeeId,
  //     //   currentDelegate.id,
  //     //   currentDelegate.name,
  //     //   currentDelegate.email,
  //     //   currentDelegate.inviteStatus,
  //     //   currentDelegate.totalSpeakingDuration,
  //     //   currentDelegate.positionPaperSent,
  //     // );
  //     console.log(`Delegate ${localCurrentSpeakerId.name} has started speaking.`);
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
            // clearSpeakers();
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
              onNext={handleTimerComplete}
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
              currentSpeakers={speakers.map((s) => s.id)}
            />

            {/* vv filter for speakers with an order > 0 */}
            <SpeakerList speakers={speakers.map((d) => d.name)} onClear={clearSpeakers} />
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
            <SpeakerSelector delegates={delegates} onAddSpeaker={updateCurrentSpeaker} />
          </Group>
        </>
      )} */}
    </Stack>
  );
};

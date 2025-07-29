import { ReactElement, useEffect, useState } from 'react';
import { Center, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { DelegateTimer } from '@features/chairing/components/DelegateTimer';
import { useParams } from 'react-router-dom';
import { useCommitteeDelegate, useCommitteeDelegates, useMotion } from '@hooks/useNewStuff';
import { SpeakerSelector } from '@features/chairing/components/SpeakerSelector';
import type { DelegateDoc } from '@features/types';
import { updateFirestoreDocument } from '@packages/firestoreAsQuery/firestoreRequests';
import { committeeMotionPath } from '@packages/firestorePaths';
import { useCurrentSpeaker } from '@hooks/useSpeakerLog';
import { committeeMutations } from '@mutations/committeeMutation';

const { addMotionSpeakerLog } = committeeMutations();

export const Caucus = (): ReactElement => {
  const { committeeId, motionId } = useParams<{
    committeeId: string;
    motionId: string;
  }>();

  const { delegates, loading: delsLoading } =
    useCommitteeDelegates(committeeId!);
  const { motion, loading: motionLoading } =
    useMotion(committeeId!, motionId!);
  const { speakerId, loading: getSpeakerLoading } = 
    useCurrentSpeaker(committeeId!, motionId!);
  console.log('fetched speaker:', speakerId);

  const [currentSpeaker, setCurrentSpeaker] = useState<DelegateDoc | null>(null);

  // const { delegate, loading: delLoading } =
  //   useCommitteeDelegate(committeeId!, speakerId ?? '');

  // TODO: probably we will need something to keep track of active caucus / motion ?

  // useEffect(() => {
  //   const path = committeeMotionPath(committeeId!, motionId!);
  //   if (!currentSpeaker) {
  //     updateFirestoreDocument(path, {
  //     currentSpeaker: '',
  //   })
  //   console.log('updated speaker:', currentSpeaker)
  //   } else {
  //     updateFirestoreDocument(path, {
  //       currentSpeaker: currentSpeaker.id,
  //     }).catch(console.error);
  //   }}, [currentSpeaker, committeeId, motionId]);

  // sets current speaker when the speakerId in db changes
  useEffect(() => {
    const found = delegates.find((d) => d.id === speakerId) ?? null;
    console.log('current speaker:', found);
    setCurrentSpeaker(found);
  }, [speakerId, delegates]);

  // sends the updated speakerId (from ui) to the db TODO: make cloud function for this also
  const updateCurrentSpeaker = (delegate: DelegateDoc | null): void => {

    if (currentSpeaker) {
    addMotionSpeakerLog(committeeId!, motionId!, currentSpeaker.id, Date.now().toString(), 'end', Date.now() as EpochTimeStamp)
      .catch(console.error);
    }
    
    const path = committeeMotionPath(committeeId!, motionId!);
    if (!delegate) {
      updateFirestoreDocument(path, {
      currentSpeaker: '',
    })

    setCurrentSpeaker(delegate);
    console.log('updated speaker:', delegate)
    } else {
      updateFirestoreDocument(path, {
        currentSpeaker: delegate.id,
      }).catch(console.error);
    }
  }
  
  if (delsLoading || motionLoading || getSpeakerLoading) {
      return (
        <Center>
          <Text>Loading...</Text>
        </Center>
      );
    }

  return (
    <Stack p="xl">
      <Title order={1}>Caucus</Title>
      <Text size="md" c="dimmed">
        Motion: {motion?.topic || 'No active motion.'}
      </Text>

      {currentSpeaker ? (
        <DelegateTimer
          cid={committeeId!}
          mid={motionId!}
          delegate={currentSpeaker}
          showNext={false}
          // onNext={} this should actually only be in speaker list i think
        />
      ) : (
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" justify="center">
            <Text c="dimmed">No current speaker.</Text>
          </Stack>
        </Paper>
      )}

      <Group grow align="flex-start">
        <SpeakerSelector
          delegates={delegates}
          onAddSpeaker={updateCurrentSpeaker}
        />
      </Group>
    </Stack>
  );
};

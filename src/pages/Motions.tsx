import { ReactElement, useEffect, useState } from 'react';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { MotionDoc } from '@features/types';
import { Motion } from '@features/chairing/components/Motion';
import { useCommitteeDelegates } from '@hooks/useNewStuff';
import { useNavigate, useParams } from 'react-router-dom';
import { committeeMutations } from '@mutations/committeeMutation';
import { generateMotionId } from '@packages/generateIds';
import { committeeQueries } from '@mutations/committeeQueries';

const { addCommitteeMotion, removeCommitteeMotion } = committeeMutations();

export const Motions = (): ReactElement => {
  const navigate = useNavigate();
  const { committeeId } = useParams<{ committeeId: string }>();
  const [motions, setMotions] = useState<MotionDoc[]>([]);
  const { delegates } = useCommitteeDelegates(committeeId);
  useEffect(() => {
      if (committeeId) {
        committeeQueries.getCommitteeMotions(committeeId)
          .then(setMotions)
          .catch((err) => console.error('Failed to fetch motions:', err));
      }
    }, [committeeId]);
    
  if (!committeeId) {
    console.error('committeeId is undefined');
    return <Text c="red">Committee ID is missing.</Text>;
  }

 

  const addMotion = () => {
    const motion: MotionDoc = {
      id: generateMotionId(),
      delegate: '',
      type: 'moderated',
      totalTime: undefined,
      speakingTime: undefined,
      topic: '',
    };
    setMotions((prev) => [...prev, motion]);

  //   // Call DB mutation with empty/default values
  //   addCommitteeMotion(
  //     committeeId,
  //     motion.id,
  //     motion.delegate,
  //     motion.type,
  //     motion.totalTime,
  //     motion.speakingTime,
  //     motion.topic,
  //   )
  //     .then(() => console.log(`Motion ${motion.id} added to committee ${committeeId}`))
  //     .catch((error) => console.error('Failed to add motion:', error));
  };

  const updateMotion = (updatedMotion: MotionDoc) => {
  setMotions((prevMotions) =>
    prevMotions.map((motion) =>
      motion.id === updatedMotion.id ? updatedMotion : motion,
    ),
  );
    addCommitteeMotion(
      committeeId,
      updatedMotion.id,
      updatedMotion.delegate,
      updatedMotion.type,
      updatedMotion.totalTime,
      updatedMotion.speakingTime,
      updatedMotion.topic,
    )
      .then(() => console.log(`Motion ${updatedMotion.id} updated`))
      .catch((error) => console.error('Failed to update motion:', error));
  };

  const removeMotion = (motionId: string) => {
    setMotions((prev) => prev.filter((motion) => motion.id !== motionId));

    // Call remove mutation
    removeCommitteeMotion(committeeId, motionId)
      .then(() => console.log(`Motion ${motionId} removed`))
      .catch((error) => console.error('Failed to remove motion:', error));
  };

  const clearMotions = () => {
    const currentMotions = [...motions];
    setMotions([]);
    for (const motion of currentMotions) {
      removeMotion(motion.id);
    }
  };

  const startMotion = (motion: MotionDoc) => {
     // Check for required fields before saving
    if (
      motion.delegate &&
      motion.topic &&
      (motion.totalTime || motion.type === 'round table') &&
      (motion.speakingTime || motion.type === 'unmoderated')
    ) 
    navigate(`/committee/${committeeId}/caucus/${motion.id}`);
    console.log(`Starting motion ${motion.id} in committee ${committeeId}`);
  };

  return (
    <Stack p="xl">
      <Group p="xl" align="flex-start">
        <Title order={1} flex={1}>
          Motions
        </Title>
        <Button variant="outline" size="md" onClick={addMotion}>
          Add Motion
        </Button>
      </Group>
      <Stack p={'xl'}>
        {motions.length > 0 ? (
          <>
            {motions.map((motion) => (
              <Motion
                key={motion.id}
                motion={motion}
                delegates={delegates}
                onChange={updateMotion}
                onRemove={removeMotion}
                onStart={startMotion}
              />
            ))}

            <Group justify="flex-end">
              <Button color="red" onClick={clearMotions}>
                Clear Motions
              </Button>
            </Group>
          </>
        ) : (
          <Text c="dimmed">No motions added yet.</Text>
        )}
      </Stack>
    </Stack>
  );
};

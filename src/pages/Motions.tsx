import { ReactElement, useState } from 'react';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { DelegateDoc, MotionDoc } from '@features/types';
import { Motion } from '@features/chairing/components/Motion';

export const Motions = (): ReactElement => {
  const [motions, setMotions] = useState<MotionDoc[]>([]);

  const newMotion: MotionDoc = {
    id: '',
    delegate: '',
    type: 'moderated',
    totalTime: undefined,
    speakingTime: undefined,
    // topic: '',
  };

  const addMotion = (motion: MotionDoc) => {
    setMotions([...motions, motion]);
    console.log(`Added ${motion} as a motion`);
  };

  const clearMotions = () => {
    setMotions([]);
  };

  return (
    <Stack p="xl">
      <Group p="xl" align="flex-start">
        <Title order={1} flex={1}>
          Motions
        </Title>
        <Button variant="outline" size="md" onClick={() => addMotion(newMotion)}>
          Add Motion
        </Button>
      </Group>
      {motions.length > 0 ? (
        <>
          {motions.map((motion, index) => (
            <Motion delegates={mockDelegates}></Motion>
          ))}
          <Button color="red" onClick={clearMotions}>
            Clear Motions
          </Button>
        </>
      ) : (
        <Text c="dimmed">No motions added yet.</Text>
      )}
    </Stack>
  );
};

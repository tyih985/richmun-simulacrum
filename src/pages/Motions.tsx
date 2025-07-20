import { ReactElement, useState } from 'react';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { DelegateDoc, MotionDoc } from '@features/types';
import { Motion } from '@features/chairing/components/Motion';

// TODO: get delegates from db
const mockDelegates: DelegateDoc[] = [
  {
    id: 'd1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    inviteStatus: 'accepted',
    minutes: 12,
    positionPaperSent: true,
    attendanceStatus: 'present',
    spoke: true,
  },
  {
    id: 'd2',
    name: 'Ben Carson',
    email: 'ben@example.com',
    inviteStatus: 'pending',
    minutes: 0,
    positionPaperSent: false,
    attendanceStatus: 'absent',
    spoke: false,
  },
  {
    id: 'd3',
    name: 'Catherine Lee',
    email: 'catherine@example.com',
    inviteStatus: 'accepted',
    minutes: 5,
    positionPaperSent: true,
    attendanceStatus: 'excused',
    spoke: false,
  },
];

export const Motions = (): ReactElement => {
  const [motions, setMotions] = useState<MotionDoc[]>([]);

  const newMotion: MotionDoc = {
    id: '',
    delegate: '',
    type: 'moderated',
    totalTime: undefined,
    speakingTime: undefined,
    // topic: '',
  }
  
  const addMotion = (motion: MotionDoc) => {
    setMotions([...motions, motion]);
    console.log(`Added ${motion} as a motion`);
  };

  const clearMotions = () => {
    setMotions([]);
  };
  
  return (
    <Stack p="xl">
      <Group p="xl" align='flex-start'>
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

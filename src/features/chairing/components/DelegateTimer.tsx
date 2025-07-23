import { Paper, Stack, Title, Group, Button } from '@mantine/core';
import { ReactElement } from 'react';
import { MotionSpeakerLogDoc, DelegateDoc } from '@features/types';
import { TimerBar } from '@components/Timer';

type Props = {
  delegate: DelegateDoc;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onComplete?: () => void;
  showNext?: boolean;
  logs: MotionSpeakerLogDoc[];
  duration?: number;
};

export const DelegateTimer = ({
  delegate,
  onStart,
  onPause,
  onResume,
  onComplete,
  logs,
  duration,
}: Props): ReactElement => {

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack align="center" justify="center" mb="md">
        <Title order={2}>{delegate.name}</Title>
      </Stack>

      <TimerBar onStart={onStart} onPause={onPause} onResume={onResume} onComplete={onComplete} duration={duration} logs={logs}/>
    </Paper>
  );
};

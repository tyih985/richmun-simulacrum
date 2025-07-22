import { TimerBar } from '@components/Timer';
import { DelegateDoc } from '@features/types';
import { Paper, Stack, Title } from '@mantine/core';
import { ReactElement, use, useEffect } from 'react';

type Props = {
  delegate: DelegateDoc;
  onStart?: () => void;
  onComplete?: () => void;
  showNext?: boolean;
};

export const DelegateTimer = ({
  delegate,
  onStart,
  onComplete,
  showNext,
}: Props): ReactElement => {
  useEffect(() => {}, [delegate]);

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack align="center" justify="center" mb="md">
        <Title order={2}>{delegate.name}</Title>
      </Stack>
      <TimerBar
        key={delegate.id}
        onStart={onStart}
        onComplete={onComplete}
        showNext={showNext}
      />
    </Paper>
  );
};

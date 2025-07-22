import { useEffect, useState } from 'react';
import { Progress, Button, Group, Stack } from '@mantine/core';

export function TimerBar() {
  const duration = 10; // total duration in seconds
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 100 / duration;
          return next >= 100 ? 100 : next;
        });
      }, 1000); // update every second
    }

    return () => clearInterval(interval);
  }, [running, progress]);

  return (
    <Stack>
      <Progress value={progress} />
      <Group mt="md" justify="center">
        <Button onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => {
            setRunning(false);
            setProgress(0);
          }}
        >
          Reset
        </Button>
      </Group>
    </Stack>
  );
}

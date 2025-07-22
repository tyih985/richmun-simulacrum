import { useEffect, useState } from 'react';
import { Progress, Button, Group, Stack } from '@mantine/core';

type Props = {
  duration?: number;
  onStart?: () => void;
  onComplete?: () => void;
  showNext?: boolean;
};

export function TimerBar({ duration = 2, onStart, onComplete, showNext }: Props) {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 100 / duration;
          if (next >= 100) {
            clearInterval(interval);
            setRunning(false);
            // setProgress(0);
          }
          return Math.min(next, 100);
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, progress, duration, onComplete]);

  const handleStart = () => {
    if (!running && onStart) {
      onStart();
    }
    setRunning((r) => !r);
  };

  return (
    <Stack>
      <Progress value={progress} color={progress == 100 ? 'red' : ''} />
      <Group mt="md" justify="center">
        <Button onClick={handleStart}>{running ? 'Pause' : 'Start'}</Button>
        {showNext && (
          <Button
            variant="outline"
            onClick={() => {
              setRunning(false);
              setProgress(0);
              onComplete?.();
            }}
          >
            Next
          </Button>
        )}
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

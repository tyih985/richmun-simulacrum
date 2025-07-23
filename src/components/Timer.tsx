import { useEffect, useState } from 'react';
import { Progress, Button, Group, Stack } from '@mantine/core';

type Props = {
  duration?: number; // in seconds
  onStart?: () => void;
  onComplete?: () => void;
  showNext?: boolean;
};

export function TimerBar({ duration = 2, onStart, onComplete, showNext }: Props) {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running) {
      const startTime = Date.now();

      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newProgress = Math.min(100, (elapsed / duration) * 100);

        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(interval);
          setRunning(false);
          onComplete?.();
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [running, duration, onComplete]);

  const handleStartPause = () => {
    if (!running && progress === 0) {
      onStart?.();
    }
    setRunning((r) => !r);
  };

  const handleNext = () => {
    setRunning(false);
    setProgress(0);
    onComplete?.();
  };

  const handleReset = () => {
    setRunning(false);
    setProgress(0);
  };

  return (
    <Stack>
      <Progress
        value={progress}
        size="lg"
        radius="md"
        color={progress >= 90 ? 'red': ''}
      />
      <Group mt="md" justify="center">
        <Button onClick={handleStartPause}>{running ? 'Pause' : progress === 100 ? 'Restart' : 'Start'}</Button>
        {showNext && (
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        )}
        <Button variant="outline" color="red" onClick={handleReset}>
          Reset
        </Button>
      </Group>
    </Stack>
  );
}

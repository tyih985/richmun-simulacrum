// src/components/Timer.tsx

import { useEffect, useRef, useState } from 'react';
import { Progress, Button, Group, Stack } from '@mantine/core';

type Props = {
  duration?: number; // seconds
  onStart?: () => void;
  onComplete?: () => void;
  showNext?: boolean;
};

export function TimerBar({
  duration = 60,
  onStart,
  onComplete,
  showNext,
}: Props) {
  const [progress, setProgress] = useState(0); // percent
  const [running, setRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Timer effect
  useEffect(() => {
    if (!running || duration <= 0) return;

    if (progress === 0) {
      onStart?.();
      startTimeRef.current = Date.now();
    } else {
      const elapsedMs = (progress / 100) * duration * 1000;
      startTimeRef.current = Date.now() - elapsedMs;
    }

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newProgress = Math.min(100, (elapsed / duration) * 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setRunning(false);
        setIsComplete(true);
        onComplete?.();
      }
    }, 100);

    return () => clearInterval(intervalRef.current!);
  }, [running, duration]);

  const handleStartPause = () => {
    if (progress >= 100 || isComplete) {
      reset();
      onStart?.();
      setRunning(true);
      return;
    }

    setRunning((prev) => !prev);
  };

  const handleNext = () => {
    reset();
    onComplete?.();
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setRunning(false);
    setProgress(0);
    setIsComplete(false);
  };

  return (
    <Stack>
      <Progress
        value={progress}
        size="lg"
        radius="md"
        color={progress >= 90 ? 'red' : 'blue'}
      />
      <Group mt="md" justify="center">
        <Button onClick={handleStartPause}>
          {progress >= 100 || isComplete
            ? 'Restart'
            : running
            ? 'Pause'
            : 'Start'}
        </Button>

        {showNext && (
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        )}

        <Button variant="outline" color="red" onClick={reset}>
          Reset
        </Button>
      </Group>
    </Stack>
  );
}

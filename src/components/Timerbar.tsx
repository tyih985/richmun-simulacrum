import { useEffect, useState, useRef } from 'react';
import { Progress, Text, Stack } from '@mantine/core';

interface TimerBarProps {
  duration: number; // duration in seconds
  onComplete?: () => void;
}

export const Timer = ({ duration, onComplete }: TimerBarProps) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const percentage = Math.min(100, (elapsed / duration) * 100);

      setProgress(percentage);

      if (elapsed >= duration) {
        clearInterval(intervalRef.current!);
        if (onComplete) onComplete();
      }
    }, 100);

    return () => clearInterval(intervalRef.current!);
  }, [duration, onComplete]);

  return (
    <Stack>
      <Progress
        value={progress}
        color={progress > 80 ? 'red' : 'blue'}
        size="lg"
        radius="md"
      />
      <Text size="sm">
        {Math.min(duration, Math.floor((progress / 100) * duration))}s elapsed
      </Text>
    </Stack>
  );
};

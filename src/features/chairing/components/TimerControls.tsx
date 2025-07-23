import { MotionSpeakerLogDoc } from '@features/types';

type Props = {
  logs: MotionSpeakerLogDoc[];
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
};

export const TimerControls = ({ logs, onStart, onPause, onResume, onComplete }: Props) => {
  const lastLogType = logs.length > 0 ? logs[logs.length - 1].type : null;

  // Determine states
  const isNotStarted = !lastLogType; // no logs yet
  const isRunning = lastLogType === 'start' || lastLogType === 'resume';
  const isPaused = lastLogType === 'pause';
  const isEnded = lastLogType === 'end';

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Start / End Button */}
      <button
        disabled={isEnded}
        onClick={() => {
          if (isNotStarted) onStart();
          else if (isRunning || isPaused) onComplete();
        }}
      >
        {isNotStarted ? 'Start' : (isRunning || isPaused) ? 'End' : 'Start'}
      </button>

      {/* Pause / Resume Button */}
      <button
        disabled={isNotStarted || isEnded}
        onClick={() => {
          if (isRunning) onPause();
          else if (isPaused) onResume();
        }}
      >
        {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
};

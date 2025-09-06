import { ReactElement, useEffect, useRef, useState } from 'react';
import { Paper, Stack, Title, Text, Group, Button, Progress } from '@mantine/core';
// import { TimerBar } from '@components/Timer';
import type {
  DelegateDoc,
  MotionSpeakerDoc,
  MotionSpeakerLogDoc,
  SpeakerLogEntry,
} from '@features/types';
import { useSpeakerLogs } from '@hooks/useSpeakerLog';
import { committeeMutations } from '@mutations/committeeMutation';

const { addMotionSpeakerLog, removeMotionSpeakerLog } = committeeMutations();

interface Props {
  cid: string;
  mid: string;
  delegate: DelegateDoc | MotionSpeakerDoc | null;
  onNext?: () => void;
  showNext?: boolean;
}

// calculates speaking time using list of logs
const calculateAccumulatedTime = (logs: MotionSpeakerLogDoc[]) => {
  let acc = 0;
  let since: number | null = null;

  logs.forEach(({ type, timestamp }) => {
    const t = timestamp as number;

    if (type === 'start' || type === 'resume') {
      since = t;
    } else if ((type === 'pause' || type === 'end') && since != null) {
      acc += t - since;
      since = null;
    }
  });

  return { acc, since };
};

// TODO: make this a prop
const duration = 10;

export const DelegateTimer = ({
  cid,
  mid,
  delegate,
  onNext,
  showNext = false,
}: Props): ReactElement => {
  const { logs, loading } = useSpeakerLogs(cid, mid, delegate ? delegate.id : '') as {
    logs: MotionSpeakerLogDoc[];
    loading: boolean;
  };

  const prevLastLogType = useRef<string | null>(null); // for safety guard
  const lastLog = logs.length ? logs[logs.length - 1] : null;

  const resetted = useRef<boolean>(false);
  const paused = useRef<boolean>(false);
  const turnStartRef = useRef<number | null>(null);

  useEffect(() => {
    let currentStart: number | null = null;

    for (let i = logs.length - 1; i >= 0; i--) {
      const { type, timestamp } = logs[i];
      if (type === 'start') {
        currentStart = timestamp as number;
        break;
      }
    }

    turnStartRef.current = currentStart;
  }, [logs]);

  const accMsRef = useRef(0);
  const runningSinceRef = useRef<number | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {}, [delegate?.id]);

  // Calculate accumulated speaking time from last start
  useEffect(() => {
    if (
      lastLog?.type === 'end'
      // && prevLastLogType.current !== 'end' safety guard check idk if we need
    ) {
      accMsRef.current = 0;
      runningSinceRef.current = null;
      setNowMs(Date.now());
      return;
    }

    prevLastLogType.current = lastLog?.type ?? null;

    const relevantLogs = logs.filter(
      (log) => (log.timestamp as number) >= (turnStartRef.current ?? 0),
    );

    const { acc, since } = calculateAccumulatedTime(relevantLogs);
    accMsRef.current = acc;
    runningSinceRef.current = since;
  }, [logs]);

  // Real-time timer updates if currently speaking
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const current = Date.now();
      setNowMs(current);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!delegate) {
    return <Text>no delegate selected.</Text>;
  }

  const elapsedMs =
    runningSinceRef.current != null
      ? accMsRef.current + (nowMs - runningSinceRef.current)
      : accMsRef.current;

  const seconds = Math.floor(elapsedMs / 1000);

  const logAction = (type: SpeakerLogEntry) => {
    const logId = Date.now().toString();
    addMotionSpeakerLog(
      cid,
      mid,
      delegate.id,
      logId,
      type,
      Date.now() as EpochTimeStamp,
    ).catch(console.error);
  };

  const progress = (elapsedMs / 1000 / duration) * 100;

  const reset = (start: number | null) => {
    if (start == null) {
      console.log('no start found so nothing to reset');
      return;
    }
    const relevantLogs = logs.filter((log) => (log.timestamp as number) >= start);
    relevantLogs.forEach(({ timestamp }) => {
      removeMotionSpeakerLog(cid, mid, delegate.id, timestamp.toString());
    });
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack align="center" mb="md">
        { loading &&
          <Title order={2}>{''}</Title> // TODO: make it better maybe
        }
        <Title order={2}>{delegate.name}</Title>
        <Text size="xl">{seconds}s</Text>
      </Stack>

      {/* <TimerBar
        progress
        showNext={showNext}
      /> */}

      {/* <Progress
        value={progress}
        size="lg"
        radius="md"
        color={progress >= 90 ? 'red' : 'blue'}
        transitionDuration={0}
      /> */}

      <Group justify="center" mt="sm" p="md">
        {(lastLog == null || lastLog?.type === 'end' || resetted.current) ? (
          <Button w={'100px'} onClick={() => {
            resetted.current = false;
            paused.current = false;
            console.log('resetted:', resetted.current)
            console.log('paused:', paused.current)
            logAction('start')
          }}>Start</Button>
        ) : (!paused.current || runningSinceRef.current != null) ? (
          <Button w={'100px'} onClick={() => {
            paused.current = true;
            console.log('paused:', paused.current)
            logAction('pause')
          }}>Pause</Button>
        ) : (
          <Button w={'100px'} onClick={() => {
            logAction('resume')
          }}>Resume</Button>
        )}
        <Button
          variant="outline"
          disabled={lastLog?.type === 'end' || lastLog == null}
          color="red"
          onClick={() => {
          resetted.current = true;
          accMsRef.current = 0;
          runningSinceRef.current = null;  
          reset(turnStartRef.current);
          turnStartRef.current = null;
          setNowMs(Date.now());
        }}
        >
          Reset
        </Button>

        {showNext && (
          <Button color="red" onClick={onNext}>
            Next Speaker
          </Button>
        )}
      </Group>
    </Paper>
  );
};

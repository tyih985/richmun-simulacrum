import { ReactElement, useEffect, useRef, useState } from 'react';
import { Paper, Stack, Title, Text, Group, Button } from '@mantine/core';
import { TimerBar } from '@components/Timer';
import type {
  DelegateDoc,
  MotionSpeakerLogDoc,
  SpeakerLogEntry,
} from '@features/types';
import { useSpeakerLog } from '@hooks/useSpeakerLog';
import { committeeMutations } from '@mutations/committeeMutation';

const { addMotionSpeakerLog } = committeeMutations();

interface Props {
  cid: string;
  mid: string;
  delegate: DelegateDoc | null;
  onNext?: () => void;
  showNext?: boolean;
}

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


export const DelegateTimer = ({
  cid,
  mid,
  delegate,
  onNext,
  showNext = false,
}: Props): ReactElement => {
  const { logs, loading } = useSpeakerLog(cid, mid, delegate ? delegate.id : '') as {
    logs: MotionSpeakerLogDoc[];
    loading: boolean;
  };

  const prevLastLogType = useRef<string | null>(null); // for safety guard
  const lastLog = logs.length ? logs[logs.length - 1] : null;


  // TODO: 
  // - a speakers time should reset after they end
  // - calculate total total accumulated speaking time separately somewhere else

  // useEffect(() => {
  //   if (lastLog?.type === 'end' 
  //     // && prevLastLogType.current !== 'end' safety guard check idk if we need 
  //   ) {
  //     console.log('lastLog:', lastLog)
  //     setAccMs(0);
  //     console.log('accMs:', accMs)
  //     setRunningSince(null);
  //     console.log('running since:', runningSince)
  //     setNowMs(Date.now());
  //     console.log('nowMs:', nowMs)
  //   }
  //   prevLastLogType.current = lastLog?.type ?? null;
  // }, [logs]);


  const [turnStart, setTurnStart] = useState<number | null>(null);

  useEffect(() => {
  let currentStart: number | null = null;

  // Find the most recent 'start' or 'resume' going backwards
  for (let i = logs.length - 1; i >= 0; i--) {
    const { type, timestamp } = logs[i];
    if (type === 'start') {
      currentStart = timestamp as number;
      break;
    }
  }

  setTurnStart(currentStart);
}, [logs]);


  const [accMs, setAccMs] = useState(0);
  const [runningSince, setRunningSince] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  // Calculate accumulated speaking time from last start
  useEffect(() => {
    if (lastLog?.type === 'end' 
      // && prevLastLogType.current !== 'end' safety guard check idk if we need 
    ) {
      setAccMs(0);
      setRunningSince(null);
      setNowMs(Date.now());
      return;
    }

    prevLastLogType.current = lastLog?.type ?? null;
    // let acc = 0;
    // let since: number | null = null;

    const relevantLogs = turnStart != null
    ? logs.filter(log => (log.timestamp as number) >= turnStart)
    : logs;

    const { acc, since } = calculateAccumulatedTime(relevantLogs);
    setAccMs(acc);
    setRunningSince(since);
  }, [logs]);

  // Real-time timer updates if currently speaking
  useEffect(() => {
    if (runningSince == null) return;

    let raf: number;
    const tick = () => {
      setNowMs(Date.now());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [runningSince]);

  if (!delegate) {
    return <Text>no delegate selected.</Text>
  }
 
  const elapsedMs = runningSince != null
  ? accMs + (nowMs - runningSince)
  : accMs;


  // const elapsedMsSinceLastStart = runningSince != null && turnStart != null
  // ? nowMs - turnStart
  // : 0;

  
  // const elapsedMs = accMs + (runningSince != null ? nowMs - runningSince : 0);
  const seconds = Math.floor(elapsedMs / 1000);


  const logAction = (type: SpeakerLogEntry) => {
    const logId = Date.now().toString();
    addMotionSpeakerLog(cid, mid, delegate.id, logId, type, Date.now() as EpochTimeStamp).catch(
      console.error,
    );
  };

  if (loading) {
    return (
      <Paper p="md" radius="md" withBorder>
        <Stack align="center" mb="md">
          <Title order={2}>{delegate.name}</Title>
          <Text>Loading timer…</Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack align="center" mb="md">
        <Title order={2}>{delegate.name}</Title>
        <Text size="xl">{seconds}s</Text>
      </Stack>
      
      <TimerBar
        onStart={() => logAction('start')}
        // onComplete={() => logAction('end')}
        showNext={showNext}
      />

      <Group justify="center" mt="sm" p="md">
        {(lastLog?.type === 'end' || lastLog == null) ? (
          <Button onClick={() => logAction('start')}>Start</Button>
        ) : runningSince != null ? (
          <Button onClick={() => logAction('pause')}>Pause</Button>
        ) : (
          <Button onClick={() => logAction('resume')}>Resume</Button>
        )}
        <Button variant="outline" 
        color="red" 
        // onClick={() => {
        //   setTurnStart(null);
        //   setAccMs(0);
        //   setRunningSince(null);
        //   setNowMs(Date.now());
        // }}
        >
          Reset
        </Button>

        {showNext && <Button color="red" onClick={onNext}>Next Speaker</Button>}
      </Group>
    </Paper>
  );
};

// src/components/DelegateTimer.tsx

import { ReactElement, useEffect, useState } from 'react';
import { Paper, Stack, Title, Text, Group, Button } from '@mantine/core';
import { TimerBar } from '@components/Timer';
import type {
  DelegateDoc,
  MotionSpeakerLogDoc,
  SpeakerLogEntry,
} from '@features/types';
import { useSpeakerLog } from '@hooks/useSpeakerLog';
import { committeeMutations } from '@mutations/committeeMutation';
import { Timestamp } from 'firebase/firestore';

const { addMotionSpeakerLog } = committeeMutations();

interface Props {
  cid: string;
  mid: string;
  delegate: DelegateDoc;
  showNext?: boolean;
}

export const DelegateTimer = ({
  cid,
  mid,
  delegate,
  showNext = true,
}: Props): ReactElement => {
  const { logs, loading } = useSpeakerLog(cid, mid, delegate.id) as {
    logs: MotionSpeakerLogDoc[];
    loading: boolean;
  };

  const [accMs, setAccMs] = useState(0);
  const [runningSince, setRunningSince] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  // Calculate total accumulated speaking time
  useEffect(() => {
    let acc = 0;
    let since: number | null = null;

    logs.forEach(({ type, timestamp }) => {
      const t = (timestamp as unknown as Timestamp).toMillis();

      if (type === 'start' || type === 'resume') {
        since = t;
      } else if ((type === 'pause' || type === 'end') && since != null) {
        acc += t - since;
        since = null;
      }
    });

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

  const elapsedMs = accMs + (runningSince != null ? nowMs - runningSince : 0);
  const seconds = Math.floor(elapsedMs / 1000);

  const logAction = (type: SpeakerLogEntry) => {
    const logId = Date.now().toString();
    addMotionSpeakerLog(cid, mid, delegate.id, logId, type, Timestamp.now()).catch(
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

      <Group p="center" mb="md">
        {runningSince == null ? (
          <Button onClick={() => logAction('start')}>Start</Button>
        ) : (
          <Button onClick={() => logAction('pause')}>Pause</Button>
        )}
        <Button onClick={() => logAction('resume')} disabled={runningSince != null}>
          Resume
        </Button>
      </Group>

      <TimerBar
        onStart={() => logAction('start')}
        onComplete={() => logAction('end')}
        showNext={showNext}
      />
    </Paper>
  );
};

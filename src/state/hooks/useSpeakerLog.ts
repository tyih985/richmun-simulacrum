import { useState, useEffect } from 'react';
import { useFirestoreCollectionQuery } from '@packages/firestoreAsQuery';
import {
  committeeMotionPath,
  motionSpeakerLogsPath,
} from '@packages/firestorePaths';
import type { MotionDoc, MotionSpeakerLogDoc } from '@features/types';
import { doc, DocumentReference, onSnapshot } from 'firebase/firestore';
import { firestoreDb } from '@packages/firebase/firestoreDb';

export const useSpeakerLog = (
  cid: string,
  mid: string,
  did: string,
): { logs: MotionSpeakerLogDoc[]; loading: boolean } => {
  const path = motionSpeakerLogsPath(cid, mid, did);
  const { data, isLoading, isError } =
    useFirestoreCollectionQuery<MotionSpeakerLogDoc>(path, {
      enabled: !!did,
      sortBy: 'timestamp',
    });

  if (isError) console.error('useSpeakerLog error:', isError);

  return { logs: data ?? [], loading: isLoading };
};

export function useCurrentSpeaker(
  committeeId: string,
  motionId: string,
): { speakerId: string | null; loading: boolean } {
  const [speakerId, setSpeakerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!committeeId || !motionId) return;
    const path = committeeMotionPath(committeeId, motionId);
    const ref = doc(firestoreDb, path) as DocumentReference<MotionDoc>;
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const d = snap.data();
        setSpeakerId(d?.currentSpeaker ?? null);
        setLoading(false);
      },
      (err) => {
        console.error('useCurrentSpeaker listener error:', err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [committeeId, motionId]);

  return { speakerId, loading };
}

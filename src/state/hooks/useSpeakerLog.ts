import { useFirestoreCollectionQuery, useFirestoreDocQuery } from '@packages/firestoreAsQuery';
import {
  committeeMotionPath,
  motionSpeakerLogsPath,
  motionSpeakersPath,
} from '@packages/firestorePaths';
import type { MotionDoc, MotionSpeakerDoc, MotionSpeakerLogDoc } from '@features/types';
import { useEffect, useState } from 'react';
import { committeeQueries } from '@mutations/committeeQueries';

const { getCommitteeMotionSpeaker } = committeeQueries;

export const useSpeakerLogs = (
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

export function useCurrentSpeakerId(
  committeeId: string,
  motionId: string,
): { speakerId: string | null; loading: boolean } {
  const path = committeeMotionPath(committeeId, motionId);

  const { data, isLoading } = useFirestoreDocQuery<MotionDoc>(path, {
    enabled: !!path,
  });


  return {
    speakerId: data?.currentSpeaker ?? null,
    loading: isLoading,
  };
}

export function useCurrentSpeaker(
  committeeId: string,
  motionId: string,
): { speaker: MotionSpeakerDoc | null; loading: boolean } {
  const { speakerId, loading: idLoading } = useCurrentSpeakerId(committeeId, motionId);
  const [speaker, setSpeaker] = useState<MotionSpeakerDoc | null>(null);

  useEffect(() => {
    if (!speakerId) {
      setSpeaker(null);
      return;
    }

    getCommitteeMotionSpeaker(committeeId, motionId, speakerId).then(setSpeaker);
  }, [committeeId, motionId, speakerId]);

  return { speaker, loading: idLoading && !speaker };
}

export const useSpeakers = (
  cid: string,
  mid: string,
): { speakers: MotionSpeakerDoc[]; loading: boolean } => {
  const path = motionSpeakersPath(cid, mid);

  const { data, isLoading, isError } =
    useFirestoreCollectionQuery<MotionSpeakerDoc>(path, {
      enabled: !!mid,
      sortBy: 'order',
    });

  if (isError) console.error('useSpeakers error:', isError);

  return { speakers: data ?? [], loading: isLoading };
};



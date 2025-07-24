import { useFirestoreCollectionQuery, useFirestoreDocQuery } from '@packages/firestoreAsQuery';
import {
  committeeMotionPath,
  motionSpeakerLogsPath,
} from '@packages/firestorePaths';
import type { MotionDoc, MotionSpeakerLogDoc } from '@features/types';

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
  const path = committeeMotionPath(committeeId, motionId);


  const { data, isLoading } = useFirestoreDocQuery<MotionDoc>(path, {
    enabled: !!path,
  });

  return {
    speakerId: data?.currentSpeaker ?? null,
    loading: isLoading,
  };
}


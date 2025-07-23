import { useState, useEffect } from 'react';
import { useFirestoreCollectionQuery } from '@packages/firestoreAsQuery';
import { motionSpeakerLogsPath } from '@packages/firestorePaths';
import type { MotionSpeakerLogDoc } from 'src/features/types';

export const useSpeakerLog = (
  cid: string,
  mid: string,
  did: string,
): { logs: MotionSpeakerLogDoc[]; loading: boolean } => {
  const path = motionSpeakerLogsPath(cid, mid, did);

  const state = useFirestoreCollectionQuery<MotionSpeakerLogDoc>(path, {
    enabled: true,
    sortBy: 'timestamp',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(state.isLoading);
  }, [state.isLoading]);

  return {
    logs: state.data ?? [],
    loading,
  };
};

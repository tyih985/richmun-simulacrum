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
    const { data, isLoading, isError } = useFirestoreCollectionQuery<MotionSpeakerLogDoc>(path, {
    enabled: !!did, // only enable if did is defined
    sortBy: "timestamp",
    });

    if (isError) {
        console.log("error", isError);
    }
    
    console.log(data);

   return { logs: data ?? [], loading: isLoading};
}
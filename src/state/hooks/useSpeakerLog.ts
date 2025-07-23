import { useFirestoreCollectionQuery } from "@packages/firestoreAsQuery"
import { motionSpeakerLogsPath } from "@packages/firestorePaths"

export const useSpeakerLog = (cid: string, mid: string, did: string) => {
    const path = motionSpeakerLogsPath(cid, mid, did);
    const state = useFirestoreCollectionQuery(path, {enabled: true, sortBy: 'timestamp'});
    if (state.isLoading) {
        console.log('loading');
    }
    
    console.log(state.data);

    return state.data;
}
import { useFirestoreCollectionQuery } from "@packages/firestoreAsQuery"
import { motionSpeakerLogsPath } from "@packages/firestorePaths"

export const useSpeakerLog = (cid: string, mid: string, did?: string) => {
  const path = motionSpeakerLogsPath(cid, mid, did!);

  const { data, isLoading, isError } = useFirestoreCollectionQuery(path, {
    enabled: !!did, // only enable if did is defined
    sortBy: "timestamp",
  });

  if (isLoading) {
    console.log("loading");
  }

  if (isError) {
    console.log("error", isError);
  }

  console.log(data);

  return { speakerLog: data, isLoading, isError};
};



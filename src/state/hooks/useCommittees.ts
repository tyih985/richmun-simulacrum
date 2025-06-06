import {
  FirestoreQueryState,
  useFirestoreCollectionQuery,
} from '@packages/firestoreAsQuery';
import { committeesPath } from '@packages/firestorePaths';
import { CommitteeType } from '@types';

type CommitteesStoreType = {
  committees: FirestoreQueryState<CommitteeType[]>;
};

export const useCommittees = (
  simulationId: string,
  { enabled }: { enabled?: boolean },
): CommitteesStoreType => {
  const committees = useFirestoreCollectionQuery<CommitteeType>(
    committeesPath(simulationId),
    {
      enabled: !!simulationId && enabled,
    },
  );

  return {
    committees,
  };
};

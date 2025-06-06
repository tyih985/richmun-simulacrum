import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getFirestoreDocument } from '@packages/firestoreAsQuery';
import { CommitteeType } from '@types';
import { committeePath } from '@packages/firestorePaths';

type CoursesStoreType = {
  committee: UseQueryResult<CommitteeType | null, Error>;
};

export const useCommittee = (
  simulationId: string,
  committeeId: string,
): CoursesStoreType => {
  const committee = useQuery({
    queryKey: ['committee', committeeId],
    queryFn: () =>
      getFirestoreDocument<CommitteeType>(committeePath(simulationId, committeeId)),
  });

  return {
    committee,
  };
};

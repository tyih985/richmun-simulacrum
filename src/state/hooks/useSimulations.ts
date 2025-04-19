import {
  FirestoreQueryState,
  useFirestoreCollectionQuery,
} from '@packages/firestoreAsQuery';
import { userEventsPath } from '@packages/firestorePaths';

type SimulationReference = {
  sid: string;
  shortName: string;
  longName: string;
  participatingAs: 'staff' | 'delegate';
  dates: {
    start: EpochTimeStamp;
    end: EpochTimeStamp;
  };
  archived?: boolean;
};

type SimulationsStoreType = {
  staff: FirestoreQueryState<SimulationReference[]>;
  delegate: FirestoreQueryState<SimulationReference[]>;
  archived: FirestoreQueryState<SimulationReference[]>;
};

export const useSimulations = (
  uid: string,
  { enabled }: { enabled?: boolean },
): SimulationsStoreType => {
  const events = useFirestoreCollectionQuery<SimulationReference>(userEventsPath(uid), {
    enabled: !!uid && enabled,
  });

  const staffingActive = events.data?.filter(
    (event) => !event.archived && event.participatingAs === 'staff',
  );
  const delegatingActive = events.data?.filter(
    (event) => !event.archived && event.participatingAs === 'delegate',
  );
  const archived = events.data?.filter((event) => event.archived);

  return {
    staff: { ...events, data: staffingActive },
    delegate: { ...events, data: delegatingActive },
    archived: { ...events, data: archived },
  };
};

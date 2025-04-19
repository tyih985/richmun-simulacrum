import {
  FirestoreQueryState,
  useFirestoreCollectionQuery,
} from '@packages/firestoreAsQuery';

import { userEventsPath } from '@packages/firestorePaths';
import { SimulationReferenceType } from '@types';

type SimulationsStoreType = {
  admin: FirestoreQueryState<SimulationReferenceType[]>;
  overseer: FirestoreQueryState<SimulationReferenceType[]>;
  staff: FirestoreQueryState<SimulationReferenceType[]>;
  delegate: FirestoreQueryState<SimulationReferenceType[]>;
  archived: FirestoreQueryState<SimulationReferenceType[]>;
};

export const useSimulations = (
  uid: string,
  { enabled }: { enabled?: boolean },
): SimulationsStoreType => {
  const events = useFirestoreCollectionQuery<SimulationReferenceType>(userEventsPath(uid), {
    enabled: !!uid && enabled,
  });

  const adminActive = events.data?.filter(
    (event) => !event.archived && event.participatingAs === 'admin',
  );
  const overseerActive = events.data?.filter(
    (event) => !event.archived && event.participatingAs === 'overseer',
  );
  const staffingActive = events.data?.filter(
    (event) => !event.archived && event.participatingAs === 'staff',
  );
  const delegatingActive = events.data?.filter(
    (event) => !event.archived && event.participatingAs === 'delegate',
  );
  const archived = events.data?.filter((event) => event.archived);

  return {
    admin: { ...events, data: adminActive },
    overseer: { ...events, data: overseerActive },
    staff: { ...events, data: staffingActive },
    delegate: { ...events, data: delegatingActive },
    archived: { ...events, data: archived },
  };
};

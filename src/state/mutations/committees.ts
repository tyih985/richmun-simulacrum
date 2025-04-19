import {
  createFirestoreDocument,
  updateFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { committeePath } from '@packages/firestorePaths';
import { generateCommitteeId } from '@packages/generateIds';
import { CommitteeType } from 'src/types/committee';

type CommitteeMutationsType = {
  create: (simulationId: string, data: CommitteeType) => void;
  rename: (
    simulationId: string,
    committeeId: string,
    data: Partial<Pick<CommitteeType, 'shortName' | 'longName'>>,
  ) => void;
  update: (
    simulationId: string,
    committeeId: string,
    data: Partial<CommitteeType>,
  ) => void;
  archive: (simulationId: string, committeeId: string) => void;
};

export const committeeMutations = (): CommitteeMutationsType => {
  const create = (simulationId: string, data: CommitteeType) => {
    const committeeId = generateCommitteeId(data.shortName);
    return createFirestoreDocument(committeePath(simulationId, committeeId), committeeId);
  };

  const rename = (
    simulationId: string,
    committeeId: string,
    data: Partial<Pick<CommitteeType, 'shortName' | 'longName'>>,
  ) => {
    return updateFirestoreDocument(committeePath(simulationId, committeeId), data);
  };

  const update = (
    simulationId: string,
    committeeId: string,
    data: Partial<CommitteeType>,
  ) => {
    return updateFirestoreDocument(committeePath(simulationId, committeeId), data);
  };

  const archive = (simulationId: string, committeeId: string) => {
    return updateFirestoreDocument(committeePath(simulationId, committeeId), {
      archived: true,
    });
  };

  return {
    create,
    rename,
    update,
    archive,
  };
};

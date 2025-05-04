import { batchUpdateDocuments } from '@packages/firestoreAsQuery';
import { simulationPath, userEventPath } from '@packages/firestorePaths';
import { generateSimulationId } from '@packages/generateIds';
import { SimulationType } from '@types';

type SimulationsMutationsType = {
  create: (userId: string, data: SimulationType) => Promise<{ id: string }>;
  update: (
    userId: string,
    simulationId: string,
    data: Partial<SimulationType>,
  ) => Promise<void>;
  archive: (userId: string, simulationId: string) => Promise<void>;
};

export const courseMutations = (): SimulationsMutationsType => {
  const create = (userId: string, data: SimulationType) => {
    const simId = generateSimulationId();
    if (data.dates.start > data.dates.end) {
      throw new Error('Start date must be before end date');
    }
    const newSimulation = {
      id: simId,
      ...data,
    };
    const reference = {
      ...newSimulation,
      participatingAs: 'admin',
    };

    return batchUpdateDocuments([
      {
        path: userEventPath(userId, simId),
        data: reference,
      },
      {
        path: simulationPath(simId),
        data: data,
      },
    ]).then(() => ({ id: simId }));
  };

  const update = (
    userId: string,
    simulationId: string,
    data: Partial<SimulationType>,
  ) => {
    return batchUpdateDocuments([
      {
        path: userEventPath(userId, simulationId),
        data,
      },
      {
        path: simulationPath(simulationId),
        data,
      },
    ]);
  };

  const archive = (userId: string, simulationId: string) => {
    return batchUpdateDocuments([
      {
        path: userEventPath(userId, simulationId),
        data: { archived: true },
      },
      {
        path: simulationPath(simulationId),
        data: { archived: true },
      },
    ]);
  };

  return {
    create,
    update,
    archive,
  };
};

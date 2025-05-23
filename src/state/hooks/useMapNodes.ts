import { useMemo } from 'react';
import { Node } from '@xyflow/react';

import { useFirestoreCollectionQuery } from '@packages/firestoreAsQuery/firestoreSubscription';
import {
  committeeMapNodesPath,
  committeeMapBackgroundNodesPath,
} from '@packages/firestorePaths';

import { PinNodeDataType, PostableBackgroundNode, PostablePinNodeType } from '@types';

type MapNodesResult = {
  nodes: Node[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
};

export const useMapNodes = (
  committeeId: string,
  mapId: string,
  options: { enabled?: boolean; sortBy?: boolean | string } = {},
): MapNodesResult => {
  const { enabled = true, sortBy = false } = options;

  const nodesQuery = useFirestoreCollectionQuery<PostablePinNodeType>(
    committeeId && mapId ? committeeMapNodesPath(committeeId, mapId) : '',
    {
      enabled: !!committeeId && !!mapId && enabled,
      sortBy,
    },
  );

  const backgroundNodesQuery = useFirestoreCollectionQuery<PostableBackgroundNode>(
    committeeId && mapId ? committeeMapBackgroundNodesPath(committeeId, mapId) : '',
    {
      enabled: !!committeeId && !!mapId && enabled,
      sortBy,
    },
  );

  const isLoading = nodesQuery.isLoading || backgroundNodesQuery.isLoading;
  const isError = nodesQuery.isError || backgroundNodesQuery.isError;
  const error = nodesQuery.error || backgroundNodesQuery.error;

  const combinedNodes = useMemo(() => {
    const regularNodes = (nodesQuery.data || []).map(
      ({ position, type, id, ...data }) => ({
        position,
        type,
        id,
        data,
      }),
    ) as Node[];

    const processedBackgroundNodes = (backgroundNodesQuery.data || []).map(
      ({ position, id, ...data }) => ({
        position,
        id,
        data,
        type: 'background',
        draggable: false,
        selectable: false,
      }),
    ) as Node[];

    return [...regularNodes, ...processedBackgroundNodes];
  }, [nodesQuery.data, backgroundNodesQuery.data]);

  const result = useMemo(
    () => ({
      nodes: combinedNodes,
      isLoading,
      isError,
      error,
    }),
    [combinedNodes, isLoading, isError, error],
  );

  return result;
};

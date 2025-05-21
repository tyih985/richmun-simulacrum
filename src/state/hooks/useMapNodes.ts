import { useMemo } from 'react';
import { Node } from '@xyflow/react';

import { useFirestoreCollectionQuery } from '@packages/firestoreAsQuery/firestoreSubscription';
import {
  committeeMapNodesPath,
  committeeMapBackgroundNodesPath,
} from '@packages/firestorePaths';

import { PinNodeDataType } from '@types';

export const useMapNodes = (
  committeeId: string,
  mapId: string,
  options: { enabled?: boolean; sortBy?: boolean | string } = {},
) => {
  const { enabled = true, sortBy = false } = options;

  const nodesQuery = useFirestoreCollectionQuery<Node<PinNodeDataType>>(
    committeeId && mapId ? committeeMapNodesPath(committeeId, mapId) : '',
    {
      enabled: !!committeeId && !!mapId && enabled,
      sortBy,
    },
  );

  const backgroundNodesQuery = useFirestoreCollectionQuery<Node>(
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
    const regularNodes = nodesQuery.data || [];

    const processedBackgroundNodes = (backgroundNodesQuery.data || []).map((node) => ({
      ...node,
      type: 'background',
      draggable: false,
      selectable: false,
    }));

    return [...regularNodes, ...processedBackgroundNodes];
  }, [nodesQuery.data, backgroundNodesQuery.data]);

  console.log('useMapNodes - combinedNodes', combinedNodes);

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

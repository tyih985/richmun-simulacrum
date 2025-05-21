/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from '@xyflow/react';
import {
  createFirestoreDocument,
  updateFirestoreDocument,
  deleteFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { committeeMapNodePath, committeeMapNodesPath } from '@packages/firestorePaths';
import { PinNodeDataType } from '@types';
import { generateNodeId } from '@packages/generateIds';

type MapNodesMutationsType = {
  createNode: (
    committeeId: string,
    mapId: string,
    data: Omit<Node<PinNodeDataType>, 'id'>,
  ) => Promise<any>;
  updateNode: (
    committeeId: string,
    mapId: string,
    nodeId: string,
    data: Partial<Node<PinNodeDataType>>,
  ) => Promise<any>;
  deleteNode: (committeeId: string, mapId: string, nodeId: string) => Promise<any>;
  updateNodePosition: (
    committeeId: string,
    mapId: string,
    nodeId: string,
    position: { x: number; y: number },
  ) => Promise<any>;
};

export const mapNodesMutations = (): MapNodesMutationsType => {
  const createNode = (
    committeeId: string,
    mapId: string,
    data: Omit<Node<PinNodeDataType>, 'id'>,
  ) => {
    console.log('createNode', committeeId, mapId, data);
    const newNodeId = generateNodeId();
    const path = committeeMapNodePath(committeeId, mapId, newNodeId);
    return createFirestoreDocument(path, data);
  };

  const updateNode = (
    committeeId: string,
    mapId: string,
    nodeId: string,
    data: Partial<Node<PinNodeDataType>>,
  ) => {
    const path = committeeMapNodePath(committeeId, mapId, nodeId);
    return updateFirestoreDocument(path, data);
  };

  const deleteNode = (committeeId: string, mapId: string, nodeId: string) => {
    const path = committeeMapNodePath(committeeId, mapId, nodeId);
    return deleteFirestoreDocument(path);
  };

  // Specialized operations
  const updateNodePosition = (
    committeeId: string,
    mapId: string,
    nodeId: string,
    position: { x: number; y: number },
  ) => {
    const path = `${committeeMapNodesPath(committeeId, mapId)}/${nodeId}`;
    return updateFirestoreDocument(path, { position });
  };

  return {
    createNode,
    updateNode,
    deleteNode,
    updateNodePosition,
  };
};

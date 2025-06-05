/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createFirestoreDocument,
  updateFirestoreDocument,
  deleteFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { committeeMapNodePath } from '@packages/firestorePaths';
import { PostableNodeType } from '@types';
import { generateNodeId } from '@packages/generateIds';

type MapNodesMutationsType = {
  createNode: (
    committeeId: string,
    mapId: string,
    data: PostableNodeType,
  ) => Promise<any>;
  updateNode: (
    committeeId: string,
    mapId: string,
    nodeId: string,
    data: PostableNodeType,
  ) => Promise<any>;
  deleteNode: (committeeId: string, mapId: string, nodeId: string) => Promise<any>;
  updateNodePosition: (
    committeeId: string,
    mapId: string,
    nodeId: string,
    position: { x: number; y: number },
  ) => Promise<any>;
};

type OptionsType =
  | {
      enable?: boolean;
    }
  | undefined;

export const mapNodesMutations = ({
  enable = true,
}: OptionsType = {}): MapNodesMutationsType => {
  const createNode = (committeeId: string, mapId: string, data: PostableNodeType) => {
    if (enable === false) return Promise.resolve(undefined);
    const newNodeId = generateNodeId();
    const path = committeeMapNodePath(committeeId, mapId, newNodeId);
    return createFirestoreDocument(path, data);
  };

  const updateNode = (
    committeeId: string,
    mapId: string,
    nodeId: string,
    data: PostableNodeType,
  ) => {
    if (enable === false) return Promise.resolve(undefined);
    const path = committeeMapNodePath(committeeId, mapId, nodeId);
    console.log('updateNode', { path, data})
    return updateFirestoreDocument(path, data);
  };

  const deleteNode = (committeeId: string, mapId: string, nodeId: string) => {
    if (enable === false) return Promise.resolve(undefined);
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
    if (enable === false) return Promise.resolve(undefined);
    const path = committeeMapNodePath(committeeId, mapId, nodeId);
    return updateFirestoreDocument(path, { position });
  };

  return {
    createNode,
    updateNode,
    deleteNode,
    updateNodePosition,
  };
};

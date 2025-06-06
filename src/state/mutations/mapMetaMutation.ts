/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createFirestoreDocument,
  updateFirestoreDocument,
  deleteFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { committeeMapPath } from '@packages/firestorePaths';

type MapMetadataType = {
  visibilityFactions?: string[];
  [key: string]: any; // Allow for other metadata fields
};

type MapMetaMutationsType = {
  createMapMeta: (
    committeeId: string,
    mapId: string,
    data: MapMetadataType,
  ) => Promise<any>;
  updateMapMeta: (
    committeeId: string,
    mapId: string,
    data: Partial<MapMetadataType>,
  ) => Promise<any>;
  deleteMapMeta: (committeeId: string, mapId: string) => Promise<any>;
  updateVisibilityFactions: (
    committeeId: string,
    mapId: string,
    visibilityFactions: string[],
  ) => Promise<any>;
};

type OptionsType =
  | {
      enable?: boolean;
    }
  | undefined;

export const mapMetaMutations = ({
  enable = true,
}: OptionsType = {}): MapMetaMutationsType => {
  const createMapMeta = (
    committeeId: string,
    mapId: string,
    data: MapMetadataType,
  ) => {
    if (enable === false) return Promise.resolve(undefined);
    const path = committeeMapPath(committeeId, mapId);
    return createFirestoreDocument(path, data);
  };

  const updateMapMeta = (
    committeeId: string,
    mapId: string,
    data: Partial<MapMetadataType>,
  ) => {
    if (enable === false) return Promise.resolve(undefined);
    const path = committeeMapPath(committeeId, mapId);
    return updateFirestoreDocument(path, data);
  };

  const deleteMapMeta = (committeeId: string, mapId: string) => {
    if (enable === false) return Promise.resolve(undefined);
    const path = committeeMapPath(committeeId, mapId);
    return deleteFirestoreDocument(path);
  };

  // Specialized operation for updating visibility factions
  const updateVisibilityFactions = (
    committeeId: string,
    mapId: string,
    visibilityFactions: string[],
  ) => {
    if (enable === false) return Promise.resolve(undefined);
    const path = committeeMapPath(committeeId, mapId);
    return updateFirestoreDocument(path, { visibilityFactions });
  };

  return {
    createMapMeta,
    updateMapMeta,
    deleteMapMeta,
    updateVisibilityFactions,
  };
};
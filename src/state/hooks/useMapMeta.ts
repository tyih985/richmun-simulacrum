import {
  useFirestoreDocQuery,
  useFirestoreCollectionRecordQuery,
} from '@packages/firestoreAsQuery';
import { committeeMapPath } from '@packages/firestorePaths';

type MapMetadataType = {
  visibilityFactions?: string[];
};

export const useMapMeta = ({
  committeeId,
  mapId,
}: {
  committeeId: string;
  mapId: string;
}): MapMetadataType => {
  const documentQuery = useFirestoreDocQuery<MapMetadataType>(
    committeeMapPath(committeeId, mapId),
  );

  return documentQuery.data || {};
};

export const useMapsMeta = ({
  committeeId,
  mapIds,
}: {
  committeeId: string;
  mapIds: string[];
}): Record<string, MapMetadataType> => {
  // Derive collection path from document path by removing the last segment
  // This assumes committeeMapPath returns something like "committees/{committeeId}/maps/{mapId}"
  const sampleDocPath = committeeMapPath(committeeId, 'temp');
  const collectionPath = sampleDocPath.substring(0, sampleDocPath.lastIndexOf('/'));

  const collectionQuery = useFirestoreCollectionRecordQuery<MapMetadataType>(
    collectionPath,
    { enabled: !!committeeId && mapIds.length > 0 },
  );

  // Filter the results to only include the requested mapIds
  const filteredResults: Record<string, MapMetadataType> = {};

  if (collectionQuery.data) {
    mapIds.forEach((mapId) => {
      if (collectionQuery.data && collectionQuery.data[mapId]) {
        filteredResults[mapId] = collectionQuery.data[mapId];
      } else {
        // Provide empty object for maps that don't exist
        filteredResults[mapId] = {};
      }
    });
  } else {
    // If no data yet, provide empty objects for all requested maps
    mapIds.forEach((mapId) => {
      filteredResults[mapId] = {};
    });
  }

  return filteredResults;
};

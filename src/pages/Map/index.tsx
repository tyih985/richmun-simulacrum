import React from 'react';
import { useParams, useSearchParams, Navigate, useLocation } from 'react-router-dom';
import {
  ECC_COMMITTEE_KEY,
  ECC_COMMITTEE_MAP_KEY,
  FJCC_COMMITTEE_KEY,
  FJCC_COMMITTEE_MAP_KEY_1,
  FJCC_COMMITTEE_MAP_KEY_2,
  FJCC_COMMITTEE_MAP_KEY_3,
  FJCC_COMMITTEE_MAP_KEY_4,
} from '@lib/mapPrototypeKeys';
import MapView from './MapView';

export const MapRouter: React.FC = () => {
  const location = useLocation();
  const { '*': pathSuffix } = useParams<{ '*': string }>();
  const [searchParams] = useSearchParams();
  const mapKey = searchParams.get('map');

  console.log('MapRouter - pathSuffix', pathSuffix);
  console.log('MapRouter - location.pathname', location.pathname);

  // Define valid committee-map combinations
  const validCombinations: Record<string, string[]> = {
    [ECC_COMMITTEE_KEY]: [ECC_COMMITTEE_MAP_KEY],
    [FJCC_COMMITTEE_KEY]: [
      FJCC_COMMITTEE_MAP_KEY_1,
      FJCC_COMMITTEE_MAP_KEY_2,
      FJCC_COMMITTEE_MAP_KEY_3,
      FJCC_COMMITTEE_MAP_KEY_4,
    ],
  };

  // Extract committeeId from the path suffix
  const committeeId = pathSuffix?.split('/')[0] || '';

  // If no committeeId provided, redirect to the first valid committee
  if (!committeeId || committeeId === '') {
    const firstCommitteeId = Object.keys(validCombinations)[0];
    const firstMapKey = validCombinations[firstCommitteeId][0];
    return <Navigate to={`/map/${firstCommitteeId}?map=${firstMapKey}`} replace />;
  }

  // Validate committee ID
  if (!validCombinations[committeeId]) {
    return (
      <div>
        <h1>Invalid Committee</h1>
        <p>Committee ID "{committeeId}" is not valid.</p>
      </div>
    );
  }

  // If no map key provided, redirect to the first valid map for this committee
  if (!mapKey) {
    const firstMapKey = validCombinations[committeeId][0];
    return <Navigate to={`/map/${committeeId}?map=${firstMapKey}`} replace />;
  }

  // Validate map key
  if (!validCombinations[committeeId].includes(mapKey)) {
    return (
      <div>
        <h1>Invalid Map</h1>
        <p>
          Map key "{mapKey}" is not valid for committee "{committeeId}".
        </p>
      </div>
    );
  }

  // Valid combination - render the MapView component
  return <MapView committeeId={committeeId} mapKey={mapKey} />;
};

export default MapRouter;

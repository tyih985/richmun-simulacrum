import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { CommitteeAccessContext } from './CommitteeAccessContext';
import { useSession } from '@hooks/useSession';
import { useMapsMeta } from '@hooks/useMapMeta';
import {
  getCommittees,
  getCommitteeAccessLevel,
  ECC_COMMITTEE_KEY,
  ECC_COMMITTEE_MAP_KEY,
  FJCC_COMMITTEE_KEY,
  FJCC_COMMITTEE_MAP_KEY_1,
  FJCC_COMMITTEE_MAP_KEY_2,
  FJCC_COMMITTEE_MAP_KEY_3,
  FJCC_COMMITTEE_MAP_KEY_4,
  getUserCommitteeFactions,
  getAllCommitteeFactions,
} from '@lib/mapPrototypeKeys';

interface CommitteeAccessProviderProps {
  children: ReactNode;
}

// Helper function to filter maps based on user factions
const filterAvailableMaps = (
  allMaps: string[],
  mapsMetadata: Record<string, { visibilityFactions?: string[] }>,
  userFactions: string[],
): string[] => {
  return allMaps.filter((mapId) => {
    const meta = mapsMetadata[mapId];

    // If no visibility factions defined, map is available to everyone
    if (!meta?.visibilityFactions || meta.visibilityFactions.length === 0) {
      return true;
    }

    // Check if user has any of the required factions
    return meta.visibilityFactions.some(
      (faction) => userFactions.includes(faction) || faction === 'everyone',
    );
  });
};

export const CommitteeAccessProvider: React.FC<CommitteeAccessProviderProps> = ({
  children,
}) => {
  const { sessionUser, isLoggedIn } = useSession();
  const [selectedCommittee, setSelectedCommittee] = useState<string | null>(null);

  // Get all potential maps for the selected committee
  const allMaps = useMemo(() => {
    if (selectedCommittee === ECC_COMMITTEE_KEY) {
      return [ECC_COMMITTEE_MAP_KEY];
    } else if (selectedCommittee === FJCC_COMMITTEE_KEY) {
      return [
        FJCC_COMMITTEE_MAP_KEY_1,
        FJCC_COMMITTEE_MAP_KEY_2,
        FJCC_COMMITTEE_MAP_KEY_3,
        FJCC_COMMITTEE_MAP_KEY_4,
      ];
    }
    return [];
  }, [selectedCommittee]);

  // Get metadata for all maps using the new hook
  const mapsMetadata = useMapsMeta({
    committeeId: selectedCommittee || '',
    mapIds: allMaps,
  });

  // Calculate user access data
  const userAccessData = useMemo(() => {
    if (!isLoggedIn || !sessionUser?.email) {
      return {
        availableCommittees: [] as string[],
        userFactions: [] as string[],
        allFactions: [] as string[],
        accessLevel: false as const,
      };
    }

    const userEmail = sessionUser.email;
    const availableCommittees = getCommittees(userEmail) || ([] as string[]);

    const accessLevel = selectedCommittee
      ? getCommitteeAccessLevel(selectedCommittee, userEmail)
      : false;

    const allFactions = getAllCommitteeFactions(selectedCommittee || '').concat(
      accessLevel === 'staff' ? ['staff-only'] : [],
    );

    const userFactions: string[] =
      accessLevel === 'staff'
        ? allFactions
        : userEmail && selectedCommittee
          ? getUserCommitteeFactions(selectedCommittee, userEmail)
          : [];

    return {
      availableCommittees,
      userFactions,
      allFactions,
      accessLevel,
    };
  }, [isLoggedIn, sessionUser, selectedCommittee]);

  // Filter available maps based on user factions and map visibility
  const availableMaps = useMemo(() => {
    // this function might be broken
    if (!selectedCommittee || userAccessData.accessLevel === false) {
      return [];
    }

    return allMaps.filter((mapId) => {
      const mapMeta = mapsMetadata[mapId];
      const { visibilityFactions = [] } = mapMeta || {};
      if (userAccessData.accessLevel === 'staff') return true;
      if (!visibilityFactions.length) return false;
      return visibilityFactions.some(faction => 
        userAccessData.userFactions.includes(faction)
      );
    });
  }, [selectedCommittee, allMaps, mapsMetadata, userAccessData]);

  // Final context value
  const contextValue = useMemo(() => {
    console.log('re-evaluating contextValue');

    if (!isLoggedIn || !sessionUser?.email) {
      return {
        availableMaps: [],
        selectedCommittee: null,
        accessLevel: false as const,
        availableCommittees: [] as string[],
        userFactions: [] as string[],
        allFactions: [] as string[],
        setSelectedCommittee,
      };
    }

    return {
      availableMaps,
      selectedCommittee,
      accessLevel: userAccessData.accessLevel,
      availableCommittees: userAccessData.availableCommittees,
      userFactions: userAccessData.userFactions,
      allFactions: userAccessData.allFactions,
      setSelectedCommittee,
    };
  }, [isLoggedIn, sessionUser, availableMaps, selectedCommittee, userAccessData]);

  useEffect(() => {
    console.log('Committee Access data: ', contextValue);
  }, [contextValue]);

  return (
    <CommitteeAccessContext.Provider value={contextValue}>
      {children}
    </CommitteeAccessContext.Provider>
  );
};

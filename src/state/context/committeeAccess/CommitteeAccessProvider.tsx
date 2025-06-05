import React, { ReactNode, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CommitteeAccessContext } from './CommitteeAccessContext';
import { useSession } from '@hooks/useSession';
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
  getCommitteeFactions,
} from '@lib/mapPrototypeKeys';

interface CommitteeAccessProviderProps {
  children: ReactNode;
}

export const CommitteeAccessProvider: React.FC<CommitteeAccessProviderProps> = ({
  children,
}) => {
  const { sessionUser, isLoggedIn } = useSession();
  const { committeeId } = useParams<{ committeeId?: string }>();

  const contextValue = useMemo(() => {
    // If user is not logged in or no email available, return default values
    if (!isLoggedIn || !sessionUser?.email) {
      return {
        availableMaps: [],
        selectedCommittee: null,
        accessLevel: false as const,
        visibiltyFactions: [],
      };
    }

    const userEmail = sessionUser.email;
    const userCommittees = getCommittees(userEmail);

    // Determine selected committee based on URL parameter
    let selectedCommittee: string | null = null;

    if (committeeId && userCommittees.includes(committeeId)) {
      // URL parameter is valid and user has access
      selectedCommittee = committeeId;
    } else if (userCommittees.length > 0) {
      // Fallback to first available committee
      selectedCommittee = userCommittees[0];
    }

    // Get available maps for the selected committee only
    let availableMaps: string[] = [];
    if (selectedCommittee === ECC_COMMITTEE_KEY) {
      availableMaps = [ECC_COMMITTEE_MAP_KEY];
    } else if (selectedCommittee === FJCC_COMMITTEE_KEY) {
      availableMaps = [
        FJCC_COMMITTEE_MAP_KEY_1,
        FJCC_COMMITTEE_MAP_KEY_2,
        FJCC_COMMITTEE_MAP_KEY_3,
        FJCC_COMMITTEE_MAP_KEY_4,
      ];
    }

    // Get access level for the selected committee
    const accessLevel = selectedCommittee
      ? getCommitteeAccessLevel(selectedCommittee, userEmail)
      : false;

    // For now, return empty visibility factions - this can be expanded based on requirements
    const visibiltyFactions: string[] =
      userEmail && selectedCommittee
        ? getCommitteeFactions(selectedCommittee, userEmail)
        : [];

    return {
      availableMaps,
      selectedCommittee,
      accessLevel,
      visibiltyFactions,
    };
  }, [sessionUser, isLoggedIn, committeeId]);

  useEffect(()=> {
    console.log('Committee Access data: ', contextValue)
  }, [contextValue])

  return (
    <CommitteeAccessContext.Provider value={contextValue}>
      {children}
    </CommitteeAccessContext.Provider>
  );
};

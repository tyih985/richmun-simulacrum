import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { CommitteeContext } from './CommitteeContext';
import { useSession } from '@hooks/useSession';
import { committeeQueries } from '@mutations/yeahglo';
import { CommitteeDoc, UserCommitteeDoc } from '@features/types';

const { getUserCommittees } = committeeQueries;

interface CommitteeProviderProps {
  children: ReactNode;
}

export const CommitteeProvider: React.FC<CommitteeProviderProps> = ({ children }) => {
  const { sessionUser, isLoggedIn } = useSession();
  const [selectedCommittee, setSelectedCommittee] = useState<CommitteeDoc | null>(null);

  // Calculate user access data
  const userAccessData = useMemo(async () => {
    if (!isLoggedIn || !sessionUser?.email) {
      return {
        availableCommittees: [] as UserCommitteeDoc[],
        role: false as const,
      };
    }

    const uid = sessionUser.uid;
    const availableCommittees = (await getUserCommittees(uid)) || ([] as string[]);

    return {
      availableCommittees,
    };
  }, [isLoggedIn, sessionUser]);

  // Final context value
  const contextValue = useMemo(async () => {
    console.log('re-evaluating contextValue');

    if (!isLoggedIn || !sessionUser?.email) {
      return {
        selectedCommittee: null,
        role: false as const,
        availableCommittees: [] as UserCommitteeDoc[],
        setSelectedCommittee,
      };
    }

    return {
      selectedCommittee,
      availableCommittees: (await userAccessData).availableCommittees,
      userFactions: userAccessData.userFactions,
      allFactions: userAccessData.allFactions,
      setSelectedCommittee,
    };
  }, [isLoggedIn, sessionUser?.email, selectedCommittee, userAccessData]);

  useEffect(() => {
    console.log('Committee Access data: ', contextValue);
  }, [contextValue]);

  return (
    <CommitteeContext.Provider value={contextValue}>{children}</CommitteeContext.Provider>
  );
};

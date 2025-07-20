import { useEffect, useState } from 'react';
import { committeeQueries } from '@mutations/yeahglo';
import { getCommitteesForUser } from '@features/dashboard/utils';
import { CommitteeDoc, UserCommitteeDoc } from '@features/types';

const { getUserCommittees, getCommittee } = committeeQueries;

export const useUserCommittees = (uid?: string) => {
  const [userCommittees, setUserCommittees] = useState<UserCommitteeDoc[]>([]);
  const [userInvites, setUserInvites] = useState<UserCommitteeDoc[]>([]);
  const [committeeDocs, setCommitteeDocs] = useState<Record<string, CommitteeDoc>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      try {
        const all = await getUserCommittees(uid);
        const accepted = await getCommitteesForUser(all, 'accepted');
        const pending = await getCommitteesForUser(all, 'pending');

        const committeeMap: Record<string, CommitteeDoc> = {};
        await Promise.all(
          accepted.concat(pending).map(async (uc) => {
            const committee = await getCommittee(uc.id);
            if (committee) committeeMap[uc.id] = committee;
          }),
        );

        setUserCommittees(accepted);
        setUserInvites(pending);
        setCommitteeDocs(committeeMap);
      } catch (err) {
        console.error('Error loading committees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  return { userCommittees, userInvites, committeeDocs, loading };
};

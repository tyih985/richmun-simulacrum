import { useEffect, useState } from 'react';
import { committeeQueries } from '@mutations/yeahglo';
import { getCommitteesForUser } from '@features/dashboard/utils';
import {
  CommitteeDoc,
  DelegateDoc,
  MotionDoc,
  StaffDoc,
  UserCommitteeDoc,
} from '@features/types';

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

export const useCommitteeDelegates = (committeeId?: string) => {
  const [delegates, setDelegates] = useState<DelegateDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!committeeId) return;

    const fetchDelegates = async () => {
      try {
        const data = await committeeQueries.getCommitteeDelegates(committeeId);
        setDelegates(data);
      } catch (err) {
        console.error('Error loading delegates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDelegates();
  }, [committeeId]);

  return { delegates, loading };
};

export const useCommitteeStaff = (committeeId?: string) => {
  const [staff, setStaff] = useState<StaffDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!committeeId) return;

    const fetchStaff = async () => {
      try {
        const data = await committeeQueries.getCommitteeStaff(committeeId);
        setStaff(data);
      } catch (err) {
        console.error('Error loading staff:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [committeeId]);

  return { staff, loading };
};

export const useMotions = (committeeId?: string) => {
  const [motions, setMotions] = useState<MotionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!committeeId) return;

    const fetchMotions = async () => {
      try {
        const data = await committeeQueries.getCommitteeMotions(committeeId);
        setMotions(data);
      } catch (err) {
        console.error('Error loading motions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMotions();
  }, [committeeId]);

  return { motions, loading };
};

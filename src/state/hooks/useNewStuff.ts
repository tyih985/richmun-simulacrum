import { useEffect, useState } from 'react';
import { committeeQueries } from '@mutations/committeeQueries';
import { getCommitteesForUser } from '@features/dashboard/utils';
import {
  CommitteeDoc,
  DelegateDoc,
  MotionDoc,
  RollCallDelegateDoc,
  RollCallDoc,
  StaffDoc,
  UserCommitteeDoc,
} from '@features/types';
import { collection, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { committeeRollCallsDelegatesPath } from '@packages/firestorePaths';
import { firestoreDb } from '@packages/firebase/firestoreDb';

const { getUserCommittees, getUserCommittee, getCommittee, getCommitteeRollCall, getCommitteeRollCalls, getCommitteeRollCallDelegate, getCommitteeRollCallDelegates } = committeeQueries;

export const useUserCommittees = (uid?: string) => {
  const [userCommittees, setUserCommittees] = useState<UserCommitteeDoc[]>([]);
  const [userInvites, setUserInvites] = useState<UserCommitteeDoc[]>([]);
  const [committeeDocs, setCommitteeDocs] = useState<Record<string, CommitteeDoc>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!uid) return;

    setLoading(true);
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

  useEffect(() => {
    fetchData();
  }, [uid]);

  return { userCommittees, userInvites, committeeDocs, loading, refresh: fetchData };
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

export const useCommitteeDirectives = (committeeId?: string) => {
  const [directives, setDirectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!committeeId) return;

    const fetchDirectives = async () => {
      try {
        const data = await committeeQueries.getCommitteeDirectives(committeeId);
        setDirectives(data);
      } catch (err) {
        console.error('Error loading directives:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectives();
  }, [committeeId]);

  return { directives, loading };
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

export const useMotion = (committeeId?: string, motionId?: string) => {
  const [motion, setMotion] = useState<MotionDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!committeeId || !motionId) return;

    const fetchMotions = async () => {
      try {
        const data = await committeeQueries.getCommitteeMotion(committeeId, motionId);
        setMotion(data);
      } catch (err) {
        console.error('Error loading motions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMotions();
  }, [committeeId, motionId]);

  return { motion, loading };
};

export const useUserDelegate = (uid: string, cid: string) => {
  const [delegate, setDelegate] = useState<DelegateDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const { userCommittees } = useUserCommittees(uid);
  const did = userCommittees.find((uc) => uc.id === cid)?.roleId;
  console.log('delegate id:', did)

  useEffect(() => {
    if (!did || !cid) return;
    const fetchDelegate = async () => {
      try {
        const data = await committeeQueries.getCommitteeDelegate(cid, did);
        setDelegate(data);
      } catch (err) {
        console.error('Error loading user delegates:', err);
      } finally {
        setLoading(false);
      }
    };
    console.log('delegate doc:', delegate)

    fetchDelegate();
  }, [cid, did, uid]);

  return { delegate, loading };
};

export const useUserIsStaff = (uid: string, cid: string) => {
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid || !cid) return;
    const fetchRole = async () => {
      try {
        const usercomdoc = await getUserCommittee(uid, cid);
        if (usercomdoc?.role === 'staff') {
          setIsStaff(true);
        }
      } catch (err) {
        console.error('Error loading user role:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [uid, cid]);

  return { isStaff, loading };
}

export const useRollCalls = (cid?: string) => {
  const [rollCalls, setRollCalls] = useState<RollCallDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cid) return;
    const fetchRollCalls = async () => {
      setLoading(true);
      try {
        const data = await getCommitteeRollCalls(cid);
        setRollCalls(data);
      } catch (err) {
        console.error('Error loading roll calls:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRollCalls();
  }, [cid]);

  return { rollCalls, loading };
};

export const useRollCall = (committeeId?: string, rollCallId?: string) => {
  const [rollCall, setRollCall] = useState<RollCallDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!committeeId || !rollCallId) return;

    const fetchRollCall = async () => {
      try {
        const data = await getCommitteeRollCall(committeeId, rollCallId);
        setRollCall(data);
      } catch (err) {
        console.error('Error loading roll calls:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRollCall();
  }, [committeeId, rollCallId]);

  return { rollCall, loading };
};

export const useRollCallDelegates = (
  committeeId?: string,
  rollCallId?: string
) => {
  const [delegates, setDelegates] = useState<RollCallDelegateDoc[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!committeeId || !rollCallId) return;

    setLoading(true);
    const path = committeeRollCallsDelegatesPath(
      committeeId,
      rollCallId
    );
    const q = query(collection(firestoreDb, path), orderBy('name'));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as DocumentData),
        })) as RollCallDelegateDoc[];
        setDelegates(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Realtime listener error:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [committeeId, rollCallId]);

  return { delegates, loading };
};

export const useRollCallDelegate = (
  committeeId?: string,
  rollCallId?: string,
  delegateId?: string
) => {
  const [delegate, setDelegate] = useState<RollCallDelegateDoc | null>(null);
  const [loading, setLoading]   = useState(true);
  useEffect(() => {
    if (!committeeId || !rollCallId || !delegateId) {
      setDelegate(null);
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const doc = await getCommitteeRollCallDelegate(
          committeeId,
          rollCallId,
          delegateId
        );
        setDelegate(doc);
      } catch (err) {
        console.error('Error loading roll call delegate:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [committeeId, rollCallId, delegateId]);

  return { delegate, loading };
};
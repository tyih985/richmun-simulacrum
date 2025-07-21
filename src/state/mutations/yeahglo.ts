import {
  getFirestoreDocument,
  getFirestoreCollection,
} from '@packages/firestoreAsQuery/firestoreRequests';
import {
  committeePath,
  committeeStaffPath,
  committeeStaffMemberPath,
  committeeDelegatesPath,
  committeeDelegatePath,
  committeeDirectivesPath,
  committeeDirectivePath,
  committeeMotionsPath,
  committeeMotionPath,
  userCommitteesPath,
  committeeRollCallPath,
  committeeRollCallsPath,
  committeeRollCallDelegatePath,
  committeeRollCallsDelegatesPath,
} from '@packages/firestorePaths';
import {
  StaffRole,
  UserCommitteeDoc,
  CommitteeDoc,
  StaffDoc,
  DelegateDoc,
  DirectiveDoc,
  MotionDoc,
  RollCallDoc,
  RollCallDelegateDoc,
} from 'src/features/types';

export const committeeQueries = {
  getCommittee: async (committeeId: string): Promise<CommitteeDoc | null> => {
    const path = committeePath(committeeId);
    const doc = await getFirestoreDocument<Omit<CommitteeDoc, 'id'>>(path);
    if (!doc) return null;
    return { id: committeeId, ...doc };
  },

  getUserCommittees: async (uid: string): Promise<UserCommitteeDoc[]> => {
    const path = userCommitteesPath(uid);
    const docs = await getFirestoreCollection(path);

    return Promise.all(
      docs.map(async (d) => {
        const base: UserCommitteeDoc = {
          id: d.id,
          role: d.role,
          roleId: d.roleId,
          inviteStatus: d.inviteStatus,
        };

        if (d.role === 'staff') {
          const staffDoc = await getFirestoreDocument<{ staffRole: StaffRole }>(
            committeeStaffMemberPath(d.id, d.roleId),
          );
          base.staffRole = staffDoc?.staffRole;
        }

        return base;
      }),
    );
  },

  getCommitteeStaffMember: async (
    committeeId: string,
    staffId: string,
  ): Promise<StaffDoc | null> => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    const doc = await getFirestoreDocument<Omit<StaffDoc, 'id'>>(path);
    if (!doc) return null;
    return { id: staffId, ...doc };
  },

  getCommitteeStaff: async (committeeId: string): Promise<StaffDoc[]> => {
    const path = committeeStaffPath(committeeId);
    const docs = await getFirestoreCollection(path);
    return docs.map((doc) => ({
      id: doc.id,
      ...doc,
    })) as StaffDoc[];
  },

  getCommitteeDelegate: async (
    committeeId: string,
    delegateId: string,
  ): Promise<DelegateDoc | null> => {
    const path = committeeDelegatePath(committeeId, delegateId);
    const doc = await getFirestoreDocument<Omit<DelegateDoc, 'id'>>(path);
    if (!doc) return null;
    return { id: delegateId, ...doc };
  },

  getCommitteeDelegates: async (committeeId: string): Promise<DelegateDoc[]> => {
    const path = committeeDelegatesPath(committeeId);
    const docs = await getFirestoreCollection(path);
    return docs.map((doc) => ({
      id: doc.id,
      ...doc,
    })) as DelegateDoc[];
  },

  getCommitteeDirective: async (
    committeeId: string,
    directiveId: string,
  ): Promise<DirectiveDoc | null> => {
    const path = committeeDirectivePath(committeeId, directiveId);
    const doc = await getFirestoreDocument<Omit<DirectiveDoc, 'id'>>(path);
    if (!doc) return null;
    return { id: directiveId, ...doc };
  },

  getCommitteeDirectives: async (committeeId: string): Promise<DirectiveDoc[]> => {
    const path = committeeDirectivesPath(committeeId);
    const docs = await getFirestoreCollection(path);
    return docs.map((doc) => ({
      id: doc.id,
      ...doc,
    })) as DirectiveDoc[];
  },

  getCommitteeMotion: async (
    committeeId: string,
    motionId: string,
  ): Promise<MotionDoc | null> => {
    const path = committeeMotionPath(committeeId, motionId);
    const doc = await getFirestoreDocument<Omit<MotionDoc, 'id'>>(path);
    if (!doc) return null;
    return { id: motionId, ...doc };
  },

  getCommitteeMotions: async (committeeId: string): Promise<MotionDoc[]> => {
    const path = committeeMotionsPath(committeeId);
    const docs = await getFirestoreCollection(path);
    return docs.map((doc) => ({
      id: doc.id,
      ...doc,
    })) as MotionDoc[];
  },

  getCommitteeRollCall: async (
    committeeId: string,
    rollCallId: string,
  ): Promise<RollCallDoc | null> => {
    const path = committeeRollCallPath(committeeId, rollCallId);
    const doc = await getFirestoreDocument<Omit<RollCallDoc, 'id'>>(path);
    if (!doc) return null;
    return { id: rollCallId, ...doc };
  },

  getCommitteeRollCalls: async (committeeId: string): Promise<RollCallDoc[]> => {
    const path = committeeRollCallsPath(committeeId);
    const docs = await getFirestoreCollection(path);
    return docs.map((doc) => ({
      id: doc.id,
      ...doc,
    })) as RollCallDoc[];
  },

  getCommitteeRollCallDelegate: async (
    committeeId: string,
    rollCallId: string,
    delegateId: string,
  ): Promise<RollCallDoc | null> => {
    const path = committeeRollCallDelegatePath(committeeId, rollCallId, delegateId);
    const doc = await getFirestoreDocument<Omit<RollCallDelegateDoc, 'id'>>(path);
    if (!doc) return null;
    return { id: delegateId, ...doc };
  },

  getCommitteeRollCallDelegates: async (committeeId: string, rollCallId: string): Promise<RollCallDelegateDoc[]> => {
    const path = committeeRollCallsDelegatesPath(committeeId, rollCallId);
    const docs = await getFirestoreCollection(path);
    return docs.map((doc) => ({
      id: doc.id,
      ...doc,
    })) as RollCallDelegateDoc[];
  },


};